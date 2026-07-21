import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/store/AuthProvider';
import TextRevealMotion from '@/components/shadcn-space/animated-text/animated-text-06';
import { api } from '@/store/AuthProvider';

const Dashboard = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [canvasName, setCanvasName] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateCanvas = async () => {
        try {
            const response = await api.post("/canvas/createCanvas", {
                name: canvasName
            });
            navigate(`/canvas/${response.data._id}`);
        } catch (error) {
            console.log("Creating canvas failed.", error.message)
        }
    };

    return (
        <AppSidebar>
            <div className="bg-gray-50/50 dark:bg-gray-950 min-h-[calc(100vh-65px)] w-full">
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full h-full">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                        <TextRevealMotion text={`Welcome to your workspace, ${user.username}!`} />
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-11 w-full sm:w-auto cursor-pointer">
                                    <Plus className="mr-2 h-5 w-5" />
                                    New Canvas
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Canvas</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={canvasName}
                                            onChange={(e) => setCanvasName(e.target.value)}
                                            placeholder="e.g. Brainstorming Session"
                                            className="col-span-3"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateCanvas} type="submit" disabled={!canvasName.trim()} className="cursor-pointer disabled:cursor-not-allowed">
                                        Create
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Outlet />

                </div>
            </div>
        </AppSidebar>
    );
};

export default Dashboard;