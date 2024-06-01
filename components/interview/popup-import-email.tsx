'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  Dialog,
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
import { FormMessage } from '../ui/form';

const PropsCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email({ message: 'invalid email address' }),
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (field === 'email') {
      const candidate = formData.find((candidate) => candidate.id === id);
      if (candidate) {
        const updatedCandidate = { ...candidate, email: value };
        const validationResult = PropsCandidateSchema.pick({
          email: true,
        }).safeParse(updatedCandidate);
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (validationResult.success) {
            delete newErrors[id + 'email'];
          } else {
            newErrors[id + 'email'] = validationResult.error.errors[0].message;
          }
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate email format
    formData.forEach((candidate) => {
      const validationResult = PropsCandidateSchema.safeParse(candidate);
      if (!validationResult.success) {
        validationResult.error.errors.forEach((error) => {
          newErrors[candidate.id + error.path] = error.message;
        });
      }
    });

    if (Object.keys(newErrors).length === 0) {
      const finalCandidates = formData.map((candidate) => {
        const existingCandidate = dataSource.find(
          (item) => item.id === candidate.id,
        );
        return existingCandidate
          ? { ...existingCandidate, email: candidate.email }
          : candidate;
      });
      onSubmit(finalCandidates);
      setIsOpen(false);
    } else {
      setErrors(newErrors);
    }
  };
  return (
    <Dialog open={true} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="w-full">
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="w-full">
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
                      className={`w-full ${errors[candidate.id + 'email'] ? 'border-primary' : ''}`}
                    />
                    <p className="text-xs text-primary">
                      {errors[candidate.id + 'email']}
                    </p>
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
