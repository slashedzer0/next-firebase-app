'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/utils';
import { ScanQuestionsProps } from '@/types/assessment';
import { useScanStore } from '@/stores/use-scan-store';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function ScanQuestions({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  onBack,
  initialSelected,
  className,
  ...props
}: ScanQuestionsProps & React.ComponentPropsWithoutRef<'div'>) {
  const { selectedOption, setSelectedOption } = useScanStore();
  const t = useTranslations('ScanPage');

  // Update selected when navigating between questions
  useEffect(() => {
    setSelectedOption(initialSelected);
  }, [initialSelected, setSelectedOption]);

  const options = [
    { value: -1, label: t('optionStronglyDisagree') },
    { value: -0.6, label: t('optionDisagree') },
    { value: 0, label: t('optionNeutral') },
    { value: 0.6, label: t('optionAgree') },
    { value: 1, label: t('optionStronglyAgree') },
  ];

  return (
    <section className="pt-16 pb-32">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex w-full flex-col items-center">
          <div className={cn('flex flex-col gap-6 w-full md:w-[400px]', className)} {...props}>
            <Card className="border w-full">
              <CardHeader className="space-y-2">
                <Progress value={(currentQuestion / totalQuestions) * 100} className="w-full" />
                <CardDescription>
                  {t('questionLabel', { current: currentQuestion, total: totalQuestions })}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <h2 className="text-lg font-medium text-center break-words w-full">
                  {t(question.text)}
                </h2>

                <div className="grid gap-2">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => setSelectedOption(option.value.toString())}
                      className={`relative flex items-center rounded-md border p-2 text-sm cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedOption === option.value.toString()
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                    >
                      <span className="flex-grow">{option.label}</span>
                      {selectedOption === option.value.toString() && (
                        <Check className="size-3.5 text-primary shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    <ArrowLeft className="size-4 mr-2" />
                    {t('back')}
                  </Button>
                  <Button
                    onClick={() => {
                      onAnswer(Number(selectedOption));
                      setSelectedOption('');
                    }}
                    disabled={selectedOption === ''}
                    className="flex-1"
                  >
                    {t('next')}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
