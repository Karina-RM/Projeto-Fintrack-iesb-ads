// Traduz mensagens comuns do Supabase e da rede para português.
export function friendlyError(error: unknown): string {
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error);

  if (message.includes('Invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (message.includes('User already registered')) {
    return 'Este e-mail já está cadastrado.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }
  // "Network request failed": fetch do React Native; "Failed to fetch": navegador;
  // "fetch failed ... appears to be offline": fetch do Expo (SDK 57) no iOS;
  // "Unable to resolve host": Android sem rede.
  if (
    /network request failed|failed to fetch|fetch failed|appears to be offline|unable to resolve host/i.test(
      message,
    )
  ) {
    return 'Sem conexão com a internet.';
  }
  if (/rate limit/i.test(message)) {
    return 'Muitas tentativas. Aguarde um instante e tente de novo.';
  }
  return message;
}
