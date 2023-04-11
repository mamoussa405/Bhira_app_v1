import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

@Injectable()
export class PrismaService extends PrismaClient{
	constructor() {
		super(
			{
				datasources: {
					db: {
						url: process.env.DATABASE_URL,
					}
				}
			}
		);
	}
}
