import { useState } from 'react';
import '../css/components/CollapsibleBlock.css'

function CollapsibleBlock({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='headlinebox'>
      <button onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleBlock;
