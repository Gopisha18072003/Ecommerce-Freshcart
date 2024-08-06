
import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';
import RangeInput from "./RangeInput";
export default function MultipleSelect({optionsList}) {
    const [selectedValues, setSelectedValues] = useState(null);

    const optionTemplate = (option) => {
        return (
            <h1>{option.name}</h1>
        );
    };

    const panelFooterTemplate = () => {
        const length = selectedValues ? selectedValues.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center">
            <MultiSelect value={selectedValues} options={optionsList} onChange={(e) => setSelectedValues(e.value)} optionLabel="name" 
                placeholder="Filters" itemTemplate={optionTemplate} panelFooterTemplate={panelFooterTemplate} className="w-full md:w-20rem" display="chip" />
        </div>
    );
}
        