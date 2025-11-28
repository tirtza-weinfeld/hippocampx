'use client';

import { PerceptronSlide, KaTeX, type InputNodeConfig } from './perceptron';

const inputs: InputNodeConfig[] = [
  { label: 'x_1', color: '#3B82F6', weightLabel: 'w_1', yPosition: 50 },
  { label: 'x_2', color: '#3B82F6', weightLabel: 'w_2', yPosition: 100 },
  { label: 'x_m', color: '#3B82F6', weightLabel: 'w_m', yPosition: 150 },
];

export function CPerceptron() {
  return (
    <PerceptronSlide
      title="The Perceptron: Forward Propagation"
      inputs={inputs}
      hasBias={true}
      rightSideContent={
        <div className="space-y-4">
          <KaTeX
            latex={String.raw`\hat{y} = g\left(w_0 + \sum_{i=1}^{m} x_i w_i\right)`}
            displayMode
          />
          <KaTeX
            latex={String.raw`\hat{y} = g\left(w_0 + \mathbf{X}^T \mathbf{W}\right)`}
            displayMode
          />
          <div className="mt-4">
            <KaTeX
              latex={String.raw`\text{where: } \mathbf{X} = \begin{bmatrix} x_1 \\ \vdots \\ x_m \end{bmatrix} \text{ and } \mathbf{W} = \begin{bmatrix} w_1 \\ \vdots \\ w_m \end{bmatrix}`}
              displayMode
            />
          </div>
        </div>
      }
    />
  );
}

export default CPerceptron;
