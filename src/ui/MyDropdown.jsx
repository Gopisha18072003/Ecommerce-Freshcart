
import React, { useState } from "react";
import { Dropdown } from 'primereact/dropdown';

export default function MyDropdown({options}) {
    const [selectedOption, setSelectedOption] = useState(null);
    
    return (
        <div className="card flex justify-content-center">
            <Dropdown value={selectedOption} onChange={(e) => setSelectedOption(e.value)} options={options} optionLabel="name" 
                placeholder="Discount" className="w-full md:w-14rem" />
        </div>
    )
}
        