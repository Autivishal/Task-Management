import { create } from 'zustand';

export type FieldConfig = { name: string, checked: boolean };

type ViewState = {
    fields: FieldConfig[];
    toggleField: (name: string) => void;
};

export const useViewStore = create<ViewState>((set) => ({
    fields: [
        { name: 'Priority', checked: false },
        { name: 'Members', checked: true },
        { name: 'Due Date', checked: true },
        { name: 'Labels', checked: true },
        { name: 'Status', checked: false },
        { name: 'Reporter', checked: false }
    ],
    toggleField: (name) => set(state => ({
        fields: state.fields.map(f => f.name === name ? { ...f, checked: !f.checked } : f)
    }))
}));
