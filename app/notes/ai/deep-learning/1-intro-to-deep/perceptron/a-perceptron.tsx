'use client';

import { PerceptronSlide, KaTeX, type InputNodeConfig } from './perceptron';

const inputs: InputNodeConfig[] = [
  { label: 'x_1', color: '#3B82F6', weightLabel: 'w_1', yPosition: 50 },
  { label: 'x_2', color: '#3B82F6', weightLabel: 'w_2', yPosition: 100 },
  { label: 'x_m', color: '#3B82F6', weightLabel: 'w_m', yPosition: 150 },
];

export function APerceptron() {
  return (
    <PerceptronSlide
      title="The Perceptron: Forward Propagation"
      inputs={inputs}
      hasBias={false}
      rightSideContent={
        <div className="relative min-w-0 flex-shrink">
          {/* Top annotations positioned over formula */}
          <div className="relative h-12">
            <div className="absolute left-[5%] text-purple-600 text-xs text-center">
              Output
              <div>&#8595;</div>
            </div>
            <div className="absolute right-[10%] text-red-600 text-xs text-center">
              Linear combination<br />of inputs
              <div>&#8595;</div>
            </div>
          </div>

          {/* Formula */}
          <div className="my-1">
            <KaTeX
              latex={String.raw`\hat{y} = g\left(\sum_{i=1}^{m} x_i w_i\right)`}
              displayMode
            />
          </div>

          {/* Bottom annotation */}
          <div className="relative h-12">
            <div className="absolute left-[18%] text-yellow-600 text-xs text-center">
              <div>&#8593;</div>
              Non-linear<br />activation function
            </div>
          </div>
        </div>
      }
    />
  );
}

export default APerceptron;
