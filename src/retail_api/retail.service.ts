import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'

import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: { 'X-API-KEY': process.env.RETAIL_KEY },
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url)
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        // console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return [orders, pagination]
  }

  async findOrder(id: number): Promise<Order | null> {
    const resp = await this.axios.get(`/orders/${id}`, { params: { by: 'id' } })
    if (!resp.data) throw new Error('RETAIL CRM ERROR')
    return resp.data.order
  }

  async orderStatuses(): Promise<CrmType[]> {
    const resp = await this.axios.get('/order-statuses')
    if (!resp.data) throw new Error('RETAIL CRM ERROR')
    return resp.data
  }

  async productStatuses(): Promise<CrmType[]> {
    const resp = await this.axios.get('/product-statuses')
    if (!resp.data) throw new Error('RETAIL CRM ERROR')
    return resp.data
  }

  async deliveryTypes(): Promise<CrmType[]> {
    const resp = await this.axios.get('/delivery-types')
    if (!resp.data) throw new Error('RETAIL CRM ERROR')
    return resp.data
  }
}
