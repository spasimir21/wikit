interface RefreshDto {
  refreshToken: string;
}

function validateRefreshDto(dto: any): dto is RefreshDto {
  if (typeof dto !== 'object' || dto == null) return false;

  if (typeof dto.refreshToken !== 'string') return false;

  return true;
}

export { RefreshDto, validateRefreshDto };
