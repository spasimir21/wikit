interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validateRegisterDto(dto: any): dto is RegisterDto {
  if (typeof dto !== 'object' || dto == null) return false;

  if (typeof dto.username !== 'string' || dto.username.length > 100) return false;
  if (typeof dto.email !== 'string' || dto.email.length > 100) return false;
  if (typeof dto.password !== 'string' || dto.password.length > 100) return false;

  const match = dto.email.match(EMAIL_REGEX);
  if (match == null || match[0] != dto.email) return false;

  return true;
}

export { RegisterDto, validateRegisterDto };
