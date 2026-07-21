'use client'

import React, { useEffect, useState } from 'react';
import CanvasCard from './ui/CanvasCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { api, useAuth } from '@/store/AuthProvider';

export default function CanvasGrid({ filterType }) {
    const [canvases, setCanvases] = useState([]);
    const [renameCanvasId, setRenameCanvasId] = useState(null);
    const [deleteCanvasId, setDeleteCanvasId] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        let fetchedCanvases;
        const fetchCanvases = async () => {
            try {
                fetchedCanvases = await api.get("/canvas/");

                if (filterType === "owned") {
                    setCanvases(fetchedCanvases.data.filter(c => c.owner === user._id));
                } else if (filterType === "shared") {
                    setCanvases(fetchedCanvases.data.filter(c => c.sharedWith.includes(user._id)));
                } else if (filterType === "home") {
                    setCanvases(fetchedCanvases.data.slice(0, Math.min(fetchedCanvases.data.length, 5)));
                } else {
                    setCanvases(fetchedCanvases.data);
                }
            } catch (error) {
                console.log("Couldn't fetch canvases.");
            }
        };

        fetchCanvases();
    }, [filterType]);

    const handleRename = (canvasId) => {
        const canvas = canvases.find(c => c.id === canvasId || c._id === canvasId);
        if (canvas) {
            setRenameValue(canvas.name || canvas.title);
            setRenameCanvasId(canvasId);
        }
    };

    const submitRename = () => {
        if (renameValue && renameValue.trim() !== "") {
            setCanvases(prev => prev.map(canvas =>
                (canvas.id === renameCanvasId || canvas._id === renameCanvasId) ? { ...canvas, name: renameValue, title: renameValue } : canvas
            ));
        }
        setRenameCanvasId(null);
    };

    const handleDelete = (canvasId) => {
        setDeleteCanvasId(canvasId);
    };

    const confirmDelete = async () => {
        if (deleteCanvasId) {
            try {
                await api.delete(`/canvas/deleteCanvas/${deleteCanvasId}`);
                setCanvases(prev => prev.filter(canvas => canvas.id !== deleteCanvasId && canvas._id !== deleteCanvasId));
                setDeleteCanvasId(null);
            } catch (error) {
                console.error("Failed to delete canvas:", error);
            }
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {canvases.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No canvases found in this section.
                    </div>
                ) : (
                    canvases.map((canvas) => (
                        <CanvasCard
                            key={canvas._id}
                            canvas={canvas}
                            onRename={handleRename}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <Dialog open={renameCanvasId !== null} onOpenChange={(open) => !open && setRenameCanvasId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Canvas</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        placeholder="Canvas name"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename();
                        }}
                        autoFocus
                    />
                    <DialogFooter showCloseButton={true}>
                        <Button onClick={submitRename}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteCanvasId !== null} onOpenChange={(open) => !open && setDeleteCanvasId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Canvas</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this canvas?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton={true}>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}