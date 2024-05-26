import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function CollapsibleBlock({ title, children, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const startEditing = () => setIsEditing(true);
  const stopEditing = () => setIsEditing(false);

  const handleSave = () => {
    onSave();
    stopEditing();
  };

  return (
    <div className="w-full my-5 p-5 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleOpen}>
        <h2 className="text-xl font-bold">{title}</h2>
        {isOpen ? <FaChevronUp className="h-6 w-6" /> : <FaChevronDown className="h-6 w-6" />}
      </div>
      {isOpen && (
        <div className="mt-4">
          {React.cloneElement(children, { isEditing })}
          <div className="mt-4 flex space-x-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#ffa500] text-white hover:bg-white hover:text-[#ffa500] border border-[#ffa500]"
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                className="px-4 py-2 bg-[#ffa500] text-white hover:bg-white hover:text-[#ffa500] border border-[#ffa500]"
                onClick={startEditing}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollapsibleBlock;
