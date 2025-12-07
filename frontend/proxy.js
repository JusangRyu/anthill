import { NextResponse } from 'next/server';
import Web3 from 'web3';

const web3 = new Web3(); // 검증만 하니까 provider 필요 없음

export function proxy(request) {

  const authCookie = request.cookies.get('auth')?.value;

  if (!authCookie) {
      const url = new URL('/', request.url);
      url.searchParams.set('alert', 'Connect your wallet first.');
      return NextResponse.redirect(url);
  }

  try {
    const { address, signature, message, expiresAt } = JSON.parse(authCookie);

    // 1. 만료 체크
    if (Date.now() > expiresAt) {
      console.log("만료됨 → 리다이렉트");
      const url = new URL('/', request.url);
      url.searchParams.set('alert', 'Connect your wallet first.');
      return NextResponse.redirect(url);
    }

    // 2. 서명 검증 (web3.js로 0.01초 만에 됨!)
    const recovered = web3.eth.accounts.recover(message, signature);

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      console.log("서명 불일치 → 리다이렉트");
      const url = new URL('/', request.url);
      url.searchParams.set('alert', 'Connect your wallet first.');
      return NextResponse.redirect(url);
    }

    console.log("인증 성공:", address);
    // 인증 통과 → 다음으로 진행
    return NextResponse.next();

  } catch (err) {
    console.log("인증 파싱 실패 → 리다이렉트", err.message);
    const url = new URL('/', request.url);
    url.searchParams.set('alert', 'Connect your wallet first.');
    return NextResponse.redirect(url);
  }

}

export const config = {
  matcher: '/game/:path*',
};