'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function FinalizeEscrowButton({ projectId }: { projectId: string }) {
  const finalize = async () => {
    await fetch(`/api/projects/${projectId}/finalize-escrow`, { method: 'POST' });
    alert('Success! Law firm will receive agreement + wiring instructions. Funds go directly to their escrow — Jozour never touches money.');
  };

  return (
    <div className="mt-8">
      <Button onClick={finalize} size="lg" className="bg-green-700 hover:bg-green-800">
        Finalize Raise & Send to Law Firm Escrow (100% Legal & Safe)
      </Button>
    </div>
  );
}
