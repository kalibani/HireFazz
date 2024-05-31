'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '../ui/table';
import { Input } from '../ui/input';
import { z } from 'zod';

const PropsCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
type TPropsCandidateSchema = z.infer<typeof PropsCandidateSchema>;
interface FormGridProps {
  dataSource: TPropsCandidateSchema[];
  onSubmit: (updatedData: TPropsCandidateSchema[]) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const PopUpImportChecker: FC<FormGridProps> = ({
  dataSource,
  onSubmit,
  setIsOpen,
}) => {
  const [formData, setFormData] = useState(dataSource);

  const handleChange = (
    id: string,
    field: keyof TPropsCandidateSchema,
    value: string,
  ) => {
    setFormData((prevFormData) =>
      prevFormData.map((candidate) =>
        candidate.id === id ? { ...candidate, [field]: value } : candidate,
      ),
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ formData });
    // onSubmit(formData);
    // setIsOpen(false);
  };

  return (
    <Dialog open={true} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Fix Your Email Format for a Perfect Submission
          </DialogTitle>
          <DialogDescription>
            Update your information below. Click 'Save' when you're finished.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Table>
            <TableCaption>
              Review the list of your recent invalid email addresses.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <Input
                      type="text"
                      className="w-full"
                      value={candidate.name}
                      onChange={(e) =>
                        handleChange(candidate.id, 'name', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="email"
                      required
                      value={candidate.email}
                      onChange={(e) =>
                        handleChange(candidate.id, 'email', e.target.value)
                      }
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopUpImportChecker;
