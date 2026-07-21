import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import boardContext from '../store/board-context';
import { api } from '../store/AuthProvider';

const WhiteboardControls = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { elements } = useContext(boardContext);
    const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await api.put(`/canvas/updateCanvas/${id}`, { elements });
        } catch (error) {
            console.error("Failed to save canvas", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackWithSave = async () => {
        await handleSave();
        navigate('/workspace');
    };

    const handleBackWithoutSave = () => {
        navigate('/workspace');
    };

    return (
        <>
            <div className="absolute top-4 left-4 z-50">
                <Button variant="outline" className="gap-2" onClick={() => setIsBackDialogOpen(true)}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            <div className="absolute top-4 right-4 z-50">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <Dialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Go Back</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to go back? Do you want to save your current progress?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton={true}>
                        <Button variant="outline" onClick={handleBackWithoutSave}>Don't Save</Button>
                        <Button onClick={handleBackWithSave} disabled={isSaving}>Save & Go Back</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WhiteboardControls;
