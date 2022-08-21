import {
  calculateExpensesWhenReplacingOccupant,
  calculateEDPExpense,
  toFormattedExpenseValue,
} from './utils'

describe('utils', () => {
  describe('calculateExpensesWhenReplacingOccupant', () => {
    it('outputs the right result given 3 remaining occupants', () => {
      const edpExpense = calculateEDPExpense({
        period: {
          from: { day: 12, month: 7, year: 2022 },
          to: { day: 11, month: 8, year: 2022 },
        },
        valueInEUR: 57.02,
      })
      const remainingOccupantsCount = 3

      const result = calculateExpensesWhenReplacingOccupant({
        remainingOccupantsCount,
        leavingOccupant: {
          name: 'Cátia',
          leaveDate: { day: 31, month: 7, year: 2022 },
        },
        expense: edpExpense,
      })

      const toBeResult: typeof result = {
        leavingOccupantExpenseInEUR: '6.955',
        newOccupantExpenseInEUR: '3.825',
        remainingOccupantsIndividualExpenseInEUR: '10.780',
      }

      expect(result).toEqual(toBeResult)

      const expenseValueInEUR = toFormattedExpenseValue(edpExpense.valueInEUR)
      expect(expenseValueInEUR).toBe(
        toFormattedExpenseValue(
          Number(toBeResult.leavingOccupantExpenseInEUR) +
            Number(toBeResult.newOccupantExpenseInEUR) +
            Number(toBeResult.remainingOccupantsIndividualExpenseInEUR) *
              remainingOccupantsCount
        )
      )
    })
  })
})

/*
EDP
43.12
total days - 31

20 dias (R, G, E and C) EUR 27.82
 - R: 6.955
 - G: 6.955
 - E: 6.955
 - C: 6.955

 11 dias (R, G, E and J) EUR 15.30
 - R: 3.825
 - G: 3.825
 - E: 3.825
 - J: 3.825
*/
