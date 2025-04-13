import Link from 'next/link';

export default function Footer() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-800 text-center mt-10">
        <Link href="/faq">FAQ</Link> - <Link href="/privacy-policy">Privacy Policy</Link> -{' '}
        <Link href="/terms-of-service">Terms of Service</Link>
      </p>
      <p className="text-gray-800 text-center mt-1">
        <b>Shareify</b> is a <b>free</b> and <b>open-source</b> project. If you like it, please
        consider supporting me on{' '}
        <b>
          <Link href="https://github.com/mikeunge">GitHub</Link>
        </b>{' '}
        or{' '}
        <b>
          <Link href="https://instagram.com/mikeunge">Instagram</Link>
        </b>
        .
      </p>
    </div>
  );
}
