import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

console.log('DEBUG: Attempting to import lusitana font');
console.log('DEBUG: Imported lusitana:', !!lusitana);
console.log('DEBUG: lusitana.className:', lusitana?.className);

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
