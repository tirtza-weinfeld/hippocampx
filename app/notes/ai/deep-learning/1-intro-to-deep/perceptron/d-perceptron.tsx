'use client';

import { PerceptronSlide, KaTeX, SigmoidGraph, type InputNodeConfig } from './perceptron';

const inputs: InputNodeConfig[] = [
  { label: 'x_1', color: '#3B82F6', weightLabel: 'w_1', yPosition: 50 },
  { label: 'x_2', color: '#3B82F6', weightLabel: 'w_2', yPosition: 100 },
  { label: 'x_m', color: '#3B82F6', weightLabel: 'w_m', yPosition: 150 },
];

export function DPerceptron() {
  return (
    <PerceptronSlide
      title="The Perceptron: Forward Propagation"
      inputs={inputs}
      hasBias={true}
      rightSideContent={
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Activation Functions</h3>
          <KaTeX
            latex={String.raw`\hat{y} = g\left(w_0 + \mathbf{X}^T \mathbf{W}\right)`}
            displayMode
          />
          <div className="space-y-2">
            <p className="text-sm">Example: sigmoid function</p>
            <KaTeX
              latex={String.raw`g(z) = \sigma(z) = \frac{1}{1 + e^{-z}}`}
              displayMode
            />
          </div>
          <SigmoidGraph />
        </div>
      }
    />
  );
}

export default DPerceptron;
