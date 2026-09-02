import { Money } from '../value-objects/Money';

export type PaymentType = 'SINGLE' | 'RECURRING' | 'INSTALLMENT';

export class Expense {
  constructor(
    readonly id: string,
    readonly description: string,
    readonly money: Money,
    readonly categoryId: string,
    readonly date: Date,
    readonly paymentType: PaymentType,
    readonly installmentsCount: number = 1
  ) {}
}