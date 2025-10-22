import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { Smile, Meh, Frown, SmilePlus, Zap } from 'lucide-react';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
}

export function QuestionnaireModal({ isOpen, onClose, subject }: QuestionnaireModalProps) {
  const [chapter, setChapter] = useState('');
  const [confidence, setConfidence] = useState([3]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to database (mock)
    console.log({
      subject,
      chapter,
      confidence: confidence[0],
    });

    toast.success('Questionnaire submitted! Generating your personalized test...');
    
    // Reset form
    setChapter('');
    setConfidence([3]);
    onClose();
  };

  const getConfidenceIcon = (level: number) => {
    switch (level) {
      case 1:
        return <Frown className="w-8 h-8 text-red-500" />;
      case 2:
        return <Meh className="w-8 h-8 text-orange-500" />;
      case 3:
        return <Smile className="w-8 h-8 text-yellow-500" />;
      case 4:
        return <SmilePlus className="w-8 h-8 text-blue-500" />;
      case 5:
        return <Zap className="w-8 h-8 text-green-500" />;
      default:
        return <Smile className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConfidenceLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Not Confident';
      case 2:
        return 'Slightly Confident';
      case 3:
        return 'Moderately Confident';
      case 4:
        return 'Very Confident';
      case 5:
        return 'Extremely Confident';
      default:
        return 'Moderately Confident';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Test Preferences</DialogTitle>
          <DialogDescription>
            Tell us about what you'd like to practice in {subject}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="chapter">
              What chapter or lessons do you have a problem in or want to test yourself in?
            </Label>
            <Textarea
              id="chapter"
              placeholder="E.g., Binary Trees, Recursion, Chapter 5..."
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-4">
            <Label>How confident are you with this topic?</Label>
            
            <div className="flex items-center justify-center py-4">
              {getConfidenceIcon(confidence[0])}
            </div>

            <div className="text-center mb-4">
              <span className="text-sm">{getConfidenceLabel(confidence[0])}</span>
            </div>

            <Slider
              value={confidence}
              onValueChange={setConfidence}
              min={1}
              max={5}
              step={1}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not Confident</span>
              <span>Extremely Confident</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Generate Test
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
