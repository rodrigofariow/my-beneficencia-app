import { Except, Opaque } from 'type-fest'
import { Interval } from 'luxon'

export function calculateExpensesWhenReplacingOccupant({
  leavingOccupant,
  newOccupant,
  expense,
  remainingOccupantsCount,
}: {
  remainingOccupantsCount: 2 | 3
  leavingOccupant: LeavingOccupant
  newOccupant: NewOccupant
  expense: EDPExpense | VodafoneExpense
}): {
  leavingOccupantExpenseInEUR: `${number}`
  newOccupantExpenseInEUR: `${number}`
  remainingOccupantsIndividualExpenseInEUR: `${number}`
} {
  const totalOccupantsCount = remainingOccupantsCount + 1
  const expenseIntervalInDays =
    Interval.fromDateTimes(expense.period.from, expense.period.to)
      .toDuration()
      .as('days') + 1

  const leavingOccupantIntervalInDaysToPay =
    Interval.fromDateTimes(expense.period.from, leavingOccupant.leaveDate)
      .toDuration()
      .as('days') + 1

  const leavingOccupantExpenseInEUR =
    (expense.valueInEUR * leavingOccupantIntervalInDaysToPay) /
    expenseIntervalInDays /
    totalOccupantsCount

  const newOccupantIntervalInDaysToPay =
    expenseIntervalInDays - leavingOccupantIntervalInDaysToPay
  const newOccupantExpenseInEUR =
    (expense.valueInEUR * newOccupantIntervalInDaysToPay) /
    expenseIntervalInDays /
    totalOccupantsCount

  return {
    leavingOccupantExpenseInEUR: toFormattedExpenseValue(leavingOccupantExpenseInEUR),
    newOccupantExpenseInEUR: toFormattedExpenseValue(newOccupantExpenseInEUR),
    remainingOccupantsIndividualExpenseInEUR: toFormattedExpenseValue(
      expense.valueInEUR / totalOccupantsCount
    ),
  }
}

type Occupant = {
  name: string
}

type EntryExpense = {
  valueInEUR: number
  description: string
  period: {
    from: StrictDate
    to: StrictDate
  }
}

type RemainingOccupant = Occupant

export type LeavingOccupant = Occupant & {
  joinDate?: StrictDate
  leaveDate: StrictDate
}

export type NewOccupant = Occupant & {
  joinDate: StrictDate
  leaveDate?: StrictDate
}

export type StrictDate = {
  year: number
  month: number
  day: number
}

export function calculateEDPExpense({
  period,
  valueInEUR,
}: Except<EntryExpense, 'description'>): EDPExpense {
  const valueThatRodrigoHasToPayHimselfInEUR = 13.9

  return {
    description: 'EDP',
    period,
    valueInEUR: valueInEUR - valueThatRodrigoHasToPayHimselfInEUR,
  } as EDPExpense
}

type EDPExpense = Opaque<EntryExpense, 'EDP'>
type VodafoneExpense = Opaque<EntryExpense, 'Vodafone'>

export const toFormattedExpenseValue = (value: number): `${number}` =>
  value.toFixed(3) as `${number}`
