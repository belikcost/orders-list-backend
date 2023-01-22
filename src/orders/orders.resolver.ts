import {Args, Query, Resolver} from '@nestjs/graphql'
import {RetailService} from '../retail_api/retail.service'
import {OrdersFilter} from "../retail_api/types";

@Resolver('Orders')
export class OrdersResolver {
    constructor(private retailService: RetailService) {
    }

    @Query()
    async order(@Args('id') id: number) {
        return this.retailService.findOrder(id)
    }

    @Query('getOrders')
    async getOrders(@Args('page') page: string) {
        const filter: OrdersFilter = {}
        if (page) filter.page = +page
        const result = await this.retailService.orders(filter)
        return {
            orders: result[0],
            pagination: result[1]
        }
    }
}
