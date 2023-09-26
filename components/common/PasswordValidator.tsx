// Components - Common
import Requirement from '@components/common/Requirement';
// Components - Mantine
import { Progress, Stack, Text } from '@mantine/core';

// Types
import type { UseFormReturnType } from '@mantine/form';

// Utility
import { passwordValidationTexts } from '@utils/constants/authentication/formValidationTexts';
import { validatePassword, getValidPasswordConditions } from '@utils/helpers/form';

const PasswordValidator = ({
  form
}: {
  form: UseFormReturnType<any>
}) => {
  
  return (
    <Stack spacing={8}>
      <Progress
        color={getValidPasswordConditions(form).length === passwordValidationTexts.length ? 'green' : 'neutral.3'}
        value={(getValidPasswordConditions(form).length / 5) * 100}
      />
      {passwordValidationTexts.map((text, index) => (
        <Requirement
          key={index}
          condition={validatePassword(form.getInputProps('password').value)[index]}
        >
          <Text className='type-body-3'>{text}</Text>
        </Requirement>
      ))}
    </Stack>
  );
};

export default PasswordValidator;