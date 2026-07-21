import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import OrbitalSpinner from './shadcn-space/spinner/spinner-07';

export default function LoadingDialog({ open = true, fullScreen = true }) {
    return (
        <div className={fullScreen ? "h-screen w-screen bg-slate-50" : ""}>
            <Dialog open={open}>
                <DialogContent showCloseButton={false} className="flex items-center justify-center bg-transparent border-none shadow-none ring-0 sm:max-w-fit text-primary outline-none">
                    <OrbitalSpinner size="lg" />
                </DialogContent>
            </Dialog>
        </div>
    );
}
