'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Trash2, Edit, Link } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import promotionService from '@/services/promotion.api';


interface Promotion {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  url?: string;
}

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getAllPromotions();
      if (response.success) {
        const promotionsWithDates = response.data?.map(promo => ({
          ...promo,
          startDate: new Date(promo.startDate),
          endDate: new Date(promo.endDate),
          isActive: new Date() >= new Date(promo.startDate) && new Date() <= new Date(promo.endDate)
        })) || [];
        setPromotions(promotionsWithDates);
      } else {
        console.log(response)
        toast.error(response.message || 'Failed to fetch promotionss');
      }
    } catch (error) {
      toast.error('Failed to fetch promotionsd');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setUrl('');
    setStartDate(new Date());
    setEndDate(new Date());
    setCurrentPromotion(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description || !imageUrl || !startDate || !endDate) {
      toast.error("Title, description, image URL and dates are required");
      return;
    }

    if (startDate > endDate) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const promotionData = {
        title,
        description,
        imageUrl,
        url: url || undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      let response;
      if (isEditing && currentPromotion) {
        response = await promotionService.updatePromotion({
          ...promotionData,
          _id: currentPromotion._id
        });
      } else {
        response = await promotionService.createPromotion(promotionData);
      }

      if (response.success) {
        toast.success(isEditing ? "Promotion updated successfully" : "Promotion added successfully");
        await fetchPromotions();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('An error occurred while saving the promotion');
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setTitle(promotion.title);
    setDescription(promotion.description);
    setImageUrl(promotion.imageUrl);
    setUrl(promotion.url || '');
    setStartDate(new Date(promotion.startDate));
    setEndDate(new Date(promotion.endDate));
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        const response = await promotionService.deletePromotion(id);
        if (response.success) {
          toast.success("Promotion deleted successfully");
          await fetchPromotions();
        } else {
          toast.error(response.message || 'Failed to delete promotion');
        }
      } catch (error) {
        toast.error('Failed to delete promotion');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div>Loading promotions...</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Promotions Management</CardTitle>
          <Button onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add Promotion
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <TableRow key={promotion._id}>
                    <TableCell>{promotion.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{promotion.description}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {promotion.url ? (
                        <a
                          href={promotion.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <Link className="h-4 w-4 mr-1" /> Link
                        </a>
                      ) : (
                        <span className="text-gray-400">No URL</span>
                      )}
                    </TableCell>
                    <TableCell>{format(promotion.startDate, 'PPP')}</TableCell>
                    <TableCell>{format(promotion.endDate, 'PPP')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${promotion.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(promotion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(promotion._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No promotions found. Add your first promotion!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Edit Promotion' : 'Add New Promotion'}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label>Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Promotion title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Description *</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Promotion description"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Image URL *</label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Link URL (optional)</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Start Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label>End Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Create'} Promotion
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}