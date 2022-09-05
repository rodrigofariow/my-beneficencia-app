import {
  useController,
  UseControllerProps,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form'
import { Except } from 'type-fest'
import { match, P } from 'ts-pattern'
import { TextField, TextFieldProps } from '@mui/material'

type TextFieldElementProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> = {
  controllerProps: UseControllerProps<TFieldValues, TName>
} & Except<TextFieldProps, 'name' | 'onBlur' | 'onChange' | 'ref' | 'helperText'> & {
    rootRef?: TextFieldProps['ref']
    helperText?: string | (({ error }: { error: FieldError | undefined }) => string)
  }

export function TextFieldControlled<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  controllerProps,
  rootRef,
  helperText,
  ...rest
}: TextFieldElementProps<TFieldValues, TName>) {
  const { field, fieldState } = useController(controllerProps)

  return (
    <TextField
      ref={rootRef}
      inputRef={field.ref}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      error={!!fieldState.error}
      helperText={match(helperText)
        .with(P.nullish, () => fieldState.error?.message)
        .with(P.string, (text) => text)
        .with(
          // eslint-disable-next-line @typescript-eslint/ban-types
          P.when((helper): helper is Function => typeof helper === 'function'),
          (fn) => fn({ error: fieldState.error })
        )
        .exhaustive()}
      {...rest}
    />
  )
}
