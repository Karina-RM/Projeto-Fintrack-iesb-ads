import { friendlyError } from '@/utils/errors';

describe('friendlyError', () => {
  it('traduz credenciais inválidas', () => {
    expect(friendlyError({ message: 'Invalid login credentials' })).toBe(
      'E-mail ou senha incorretos.',
    );
  });

  it('traduz falha de rede do fetch do React Native', () => {
    expect(friendlyError(new TypeError('Network request failed'))).toBe(
      'Sem conexão com a internet.',
    );
  });

  it('traduz falha de rede do fetch do Expo (SDK 57, iOS em modo avião)', () => {
    const error = new Error(
      'fetch failed: UnexpectedException: The Internet connection appears to be offline. (at ExpoModulesCore/Promise.swift:56)',
    );
    expect(friendlyError(error)).toBe('Sem conexão com a internet.');
  });

  it('traduz falha de rede ao chamar uma Edge Function (FunctionsFetchError)', () => {
    expect(
      friendlyError(new Error('Failed to send a request to the Edge Function')),
    ).toBe('Sem conexão com a internet.');
  });

  it('mantém mensagens desconhecidas', () => {
    expect(friendlyError(new Error('Outro problema'))).toBe('Outro problema');
  });
});
