'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CanvasCard = ({ canvas, onRename, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full'
    >
      <Card onClick={() => navigate(`/canvas/${canvas._id || canvas.id}`)} className='p-0 w-full gap-0 border overflow-visible shadow-sm hover:shadow-md transition-shadow relative cursor-pointer'>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-40 w-full rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center"
        >
          <img
            src={canvas.imageUrl || canvas.coverImage || `https://picsum.photos/seed/${canvas._id || canvas.id || 'fallback'}/500/300?grayscale`}
            alt={canvas.name || canvas.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              console.error("Image blocked by browser:", e.target.src);
              e.target.src = `https://picsum.photos/seed/${canvas._id || canvas.id || 'error'}/500/300?grayscale`;
            }}
          />
        </motion.div>

        <CardContent className='p-5'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="flex justify-between items-start"
          >
            <div>
              <motion.h6
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className='text-base font-semibold text-foreground line-clamp-1'
              >
                {canvas.name || canvas.title}
              </motion.h6>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45 }}
                className='text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1'
              >
                <Clock className="h-3 w-3" />
                {canvas.updatedAt}
              </motion.div>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 bg-white border shadow-lg rounded-md overflow-hidden z-10"
                  >
                    {/* <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onRename(canvas._id || canvas.id);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" /> Rename
                    </button> */}
                    <div className="h-px bg-gray-100 w-full" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onDelete(canvas._id || canvas.id);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CanvasCard;