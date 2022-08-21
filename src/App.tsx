import { Box, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateExpensesWhenReplacingOccupant } from './utils'

const expenseTypes = ['EDP', 'Vodafone'] as const

const schema = z.object({
  expense: z.object({
    type: z.enum(expenseTypes),
    valueInEUR: z.number(),
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
      <Controller<Schema>
        name="expense.type"
        control={control}
        render={({ field: { onChange, ...rest } }) => (
          <TextField
            {...rest}
            select
            fullWidth
            label="Expense Type"
            onChange={(event) => {
              onChange(event.target.value)
            }}
          >
            {expenseTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller<Schema>
        name="expense.valueInEUR"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="number" fullWidth label="Expense value" />
        )}
      />
    </Box>
  )
}

export default App
