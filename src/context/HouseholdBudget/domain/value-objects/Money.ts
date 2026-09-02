export class Money {
  constructor(readonly amount: number, readonly currency: string = 'USD') {
    if (amount < 0) {
      throw new Error("El monto no puede ser negativo.");
    }
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("No se pueden sumar montos de diferentes monedas.");
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  public format(): string {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }
}