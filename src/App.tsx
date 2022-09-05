import { Box, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextFieldControlled } from './components/TextFieldControlled'
import { calculateExpensesWhenReplacingOccupant, calculateVodafoneExpense } from './utils'

const expenseTypes = ['EDP', 'Vodafone'] as const

const schema = z.object({
  expense: z.object({
    type: z.enum(expenseTypes),
    valueInEUR: z.number().positive(),
    period: z.object({
      from: z.date(),
      to: z.date(),
    }),
  }),
  leavingOccupant: z.object({
    name: z.string(),
    leaveDate: z.date(),
  }),
})

type Schema = z.infer<typeof schema>

function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: Schema) => {
    // calculateExpensesWhenReplacingOccupant({
    //   expense,
    //   leavingOccupant,
    //   remainingOccupantsCount,
    // })
  }

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component={'form'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        alignItems: 'center',
        maxWidth: 1000,
        margin: 'auto',
        gap: 2,
      }}
    >
      <TextFieldControlled<Schema>
        controllerProps={{ name: 'expense.type', control }}
        select
        fullWidth
        label="Tipo de Despesa"
      >
        {expenseTypes.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextFieldControlled>

      <TextFieldControlled<Schema>
        controllerProps={{ name: 'expense.valueInEUR', control }}
        type="number"
        fullWidth
        label="Valor da Despesa (EUR)"
      />
      {JSON.stringify(errors)}
    </Box>
  )
}

export default App

const result = calculateExpensesWhenReplacingOccupant({
  remainingOccupantsCount: 3,
  leavingOccupant: {
    name: 'Cátia',
    leaveDate: { day: 31, month: 7, year: 2022 },
  },
  expense: calculateVodafoneExpense({
    period: {
      from: { day: 23, month: 7, year: 2022 },
      to: { day: 22, month: 8, year: 2022 },
    },
    valueInEUR: 34.91,
  }),
})

console.log('calculateExpensesWhenReplacingOccupant vodafone', JSON.stringify(result))
