import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import UploadFileFactoryService from "src/util/upload-service/upload-file.service";
import ProductRepository from "../../repositories/product-repository";
import { ProductEntity } from "./entities/product.entity";
import { PrismaClient } from "@prisma/client";
import RedisClient from "src/providers/redis/redis-client";

@Injectable()
export class ProductService {
  constructor(
    public readonly prismaService: PrismaClient,
    private readonly UploadFileFactoryService: UploadFileFactoryService,
    private readonly productRepository: ProductRepository,
    private readonly redisClient: RedisClient,
  ) { }

  async create(createProductDto: CreateProductDto) {

    const [checkIfExistCategory, checkIfExistStore] = await Promise.all([
      this.prismaService.category.count({
        where: {
          id: createProductDto.category_id,
          store_id: createProductDto.store_id,
        },
      }),
      this.prismaService.store.count({
        where: {
          id: createProductDto.store_id,
        },
      }),
    ]);

    if (!checkIfExistCategory) {
      throw new BadRequestException('Category not found');
    }

    if (!checkIfExistStore) {
      throw new BadRequestException('Store not found');
    }

    let url = '';
    if (createProductDto.image_url) {
      url = await this.UploadFileFactoryService.upload(createProductDto.image_url);
    }
    const promotionProduct = createProductDto.promotion === "true";

    const cacheKey = `store:${createProductDto.store_id}:products`;
    await this.redisClient.del(cacheKey);

    return await this.prismaService.product.create({
      data: {
        ...createProductDto,
        promotion: promotionProduct,
        price: Number(createProductDto.price),
        image_url: [url],
      },
    });
  }

  async findMany(dto: UpdateProductDto): Promise<ProductEntity[]> {

    const cacheKey = `store:${dto.store_id}:products`;
    const cachedData = await this.redisClient.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as ProductEntity[];
    }

    if (!dto.store_id) {
      throw new BadRequestException('Store id is required');
    }

    const products = this.productRepository.findMany(dto);

    if (!products) {
      throw new NotFoundException('Products not found');
    }

    await this.redisClient.setValue(cacheKey, JSON.stringify(products), 60 * 3);

    return products;
  }

  async findOne(dto: UpdateProductDto): Promise<ProductEntity> {

    const cacheKey = `product:${dto.id}`;

    const cachedData = await this.redisClient.getValue(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as ProductEntity;
    }

    const product = await this.productRepository.findOne(dto);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.redisClient.setValue(cacheKey, JSON.stringify(product), 60 * 3);

    return product;

  }

  async update(updateProductDto: UpdateProductDto) {
    const cacheKey = `store:${updateProductDto.store_id}:products`;

    if (cacheKey) {
      await this.redisClient.del(cacheKey);
    }

    const existingProduct = await this.prismaService.product.findUnique({
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

    return await this.prismaService.product.update({
      where: {
        id: updateProductDto.id,
      },
      data: {
        ...updateProductDto,
        promotion: promotionProduct,
        price: price,
        image_url: [url],
      },
    })
  }

  async remove(dto: UpdateProductDto) {
    const existingProduct = await this.prismaService.product.count({
      where: {
        id: dto.id,
      },
    });

    if (existingProduct === 0) {
      throw new NotFoundException("Produto não encontrado");
    }
    return this.productRepository.remove(dto);
  }

  async getFeaturedProducts(id: string) {
    const existingStore = await this.prismaService.store.count({
      where: {
        id: id,
      },
    });

    if (existingStore === 0) {
      throw new NotFoundException("Loja não encontrada");
    }

    const featuredProducts = await this.prismaService.product.findMany({
      where: {
        store_id: id,
        promotion: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image_url: true,
        store: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!featuredProducts) {
      throw new NotFoundException("Nenhum produto destacado encontrado");
    }

    return featuredProducts;
  }
}
