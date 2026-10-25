import type { StudyMode } from '@/lib/flashcard-storage';
import type { Grade } from '@/lib/srs';
import { Button } from '@/components/ui/button';
import { GRADES } from './useFlashcards';

interface ReviewControlsProps {
  studyMode: StudyMode;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGrade: (grade: Grade) => void;
}

export default function ReviewControls({
  studyMode,
  revealed,
  onReveal,
  onNext,
  onPrev,
  onGrade,
}: ReviewControlsProps) {
  if (studyMode === 'review') {
    if (!revealed) {
      return (
        <div className="flex justify-center">
          <Button size="lg" className="min-w-40" onClick={onReveal}>
            Show answer
          </Button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Grade your recall">
        {GRADES.map((grade) => (
          <Button
            key={grade.value}
            size="lg"
            variant={grade.value === 'again' ? 'destructive' : grade.value === 'good' ? 'default' : 'secondary'}
            onClick={() => onGrade(grade.value)}
            aria-keyshortcuts={grade.key}
          >
            {grade.label}
            <kbd className="ml-1 hidden font-mono text-xs opacity-70 sm:inline">{grade.key}</kbd>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2">
      <Button size="lg" variant="outline" onClick={onPrev} aria-keyshortcuts="ArrowLeft">
        Previous
      </Button>
      <Button size="lg" className="min-w-40" onClick={revealed ? onNext : onReveal} aria-keyshortcuts="Space">
        {revealed ? 'Next' : 'Show answer'}
      </Button>
    </div>
  );
}
