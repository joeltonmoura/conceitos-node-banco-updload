/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transaction = await this.find();

    const { income, outcome } = transaction.reduce(
      (agrupador, operacao) => {
        switch (operacao.type) {
          case 'income':
            agrupador.income += Number(operacao.value);
            break;

          case 'outcome':
            agrupador.outcome += Number(operacao.value);
            break;
          default:
            break;
        }
        return agrupador;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
