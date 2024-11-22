import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ProductEntity } from "../module/product/entities/product.entity";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";
import { UpdateProductDto } from "src/module/product/dto/update-product.dto";
import { CreateProductDto } from "src/module/product/dto/create-product.dto";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";

@Injectable()
export default class ProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redisClient: RedisClient,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const cacheKey = `store:${createProductDto.store_id}:products`;

    await this.redisClient.del(cacheKey);

    const [checkIfExistCategory, checkIfExistStore] = await Promise.all([
      this.prisma.category.count({
        where: {
          id: createProductDto.category_id,
          store_id: createProductDto.store_id,
        },
      }),
      this.prisma.store.count({
        where: {
          id: createProductDto.store_id,
        },
      }),
    ]);

    if (!checkIfExistCategory) {
      throw new BadRequestException("Category not found");
    }

    if (!checkIfExistStore) {
      throw new BadRequestException("Store not found");
    }

    let url = "";

    if (createProductDto.image_url) {
      url = await this.UploadFileFactoryService.upload(
        createProductDto.image_url,
      );
    }

    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        category_id: createProductDto.category_id,
        store_id: createProductDto.store_id,
        price: Number(createProductDto.price),
        description: createProductDto.description,
        image_url: [url],
      },
    });
  }

  async findMany(dto: UpdateProductDto): Promise<ProductEntity[]> {
    const cacheKey = `store:${dto.store_id}:products`;

    if (cacheKey) {
      await this.redisClient.del(cacheKey);
    }

    const cachedData = await this.redisClient.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as ProductEntity[];
    }
    const existingStore = this.prisma.store.count({
      where: {
        id: dto.id,
      },
    });
    if (!existingStore) {
      throw new NotFoundException("Store not found");
    }
    const products = await this.prisma.product.findMany({
      where: {
        store_id: dto.id,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await this.redisClient.setValue(cacheKey, JSON.stringify(products), 60);

    return products;
  }

  async findOne(dto: UpdateProductDto): Promise<ProductEntity> {
    const cacheKey = `product:${dto.id}`;

    const cachedData = await this.redisClient.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as ProductEntity;
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: dto.id,
        store_id: dto.store_id,
      },
      select: {
        id: true,
        name: true,
        store_id: true,
        description: true,
        price: true,
        promotion: true,
        image_url: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await this.redisClient.setValue(cacheKey, JSON.stringify(product), 60 * 3);

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const cacheKey = `store:${updateProductDto.store_id}:products`;

    if (cacheKey) {
      await this.redisClient.del(cacheKey);
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id: updateProductDto.id,
      },
    });
    if (!existingProduct) {
      throw new BadRequestException("Product not found");
    }

    let [url] = existingProduct.image_url;

    if (updateProductDto.image_url) {
      url = await this.UploadFileFactoryService.upload(
        updateProductDto.image_url,
      );
    }

    let price = existingProduct.price;

    if (updateProductDto.price) {
      price = Number(updateProductDto.price);
    }

    const promotionProduct = updateProductDto.promotion === "true";

    return await this.prisma.product.update({
      where: {
        id: updateProductDto.id,
      },
      data: {
        ...updateProductDto,
        image_url: [url],
        price: price,
        promotion: promotionProduct,
      },
    });
  }

  async remove(dto: UpdateProductDto) {
    const cacheKey = `store:${dto.store_id}:products`;

    if (cacheKey) {
      await this.redisClient.delValue(cacheKey);
    }

    const existingStore = await this.prisma.product.count({
      where: {
        id: dto.id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Produto não encontrado");
    }

    return await this.prisma.product.update({
      where: {
        id: dto.id,
      },
      data: {
        enabled: false,
      },
    });
  }
}
