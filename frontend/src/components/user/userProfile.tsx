import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface IVendor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  is_blocked: boolean;
  is_googleuser: boolean;
  address?: string;
}

export const UserDetails: React.FC = () => {
  const [vendorData, setVendorData] = useState<IVendor | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState({
    house: '',
    post: '',
    city: '',
    pincode: '',
    district: '',
    state: '',
  });
  const [editDetails, setEditDetails] = useState<IVendor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState({
    house: '',
    post: '',
    city: '',
    pincode: '',
    district: '',
    state: '',
  });

  const id = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/fetchuser`, {
          params: { id },
        });
        setVendorData(response.data.data);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };
    fetchVendorData();
  }, [id]);

  const handleSubmitEditDetails = async () => {
    try {
      const response = await fetch('/api/vendor/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDetails),
      });

      if (response.ok) {
        setVendorData(editDetails);
        setIsEditModalOpen(false);
      } else {
        console.error('Failed to update vendor details');
      }
    } catch (error) {
      console.error('Error updating vendor details:', error);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newError = { house: '', post: '', city: '', pincode: '', district: '', state: '' };

    if (!address.house.trim()) {
      newError.house = 'House/Street name is required';
      valid = false;
    }
    if (!address.post.trim()) {
      newError.post = 'Post name is required';
      valid = false;
    }
    if (!address.city.trim()) {
      newError.city = 'City name is required';
      valid = false;
    }
    if (!/^[0-9]{6}$/.test(address.pincode)) {
      newError.pincode = 'Pincode must be a 6-digit number';
      valid = false;
    }
    if (!address.district.trim()) {
      newError.district = 'District name is required';
      valid = false;
    }
    if (!address.state.trim()) {
      newError.state = 'State name is required';
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleAddAddress = () => {
    if (validateForm()) {
      const fullAddress = `${address.house}, ${address.post}, ${address.city}, pin:${address.pincode}, ${address.district}, ${address.state}`;
      setVendorData((prev) => (prev ? { ...prev, address: fullAddress } : null));
      setAddress({ house: '', post: '', city: '', pincode: '', district: '', state: '' });
      setIsOpen(false);
    }
  };

  const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex items-start space-x-4 p-5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex-1">
       <div className='flex items-center justify-between'>
         <p className="text-sm text-center mb-0 font-medium text-gray-500">{label}</p>
        {label === "Address" && (
        <Button
          variant="text"
          color="primary"
          endIcon={<Pencil className="w-4 h-4" />}
          onClick={() => setIsOpen(true)}
        >
          Edit Address
        </Button>
      )}
       </div>
        <p className="mt-1 text-base text-gray-900">{value || 'Data is not available'}</p>
      </div>
      
    </div>
  );

  return (
    <div className="flex-1 mx-auto pt-32 space-y-10 pb-28">
      {/* Hero Section */}
      <div className="relative container bg-gradient-to-r from-blue-600 to-purple-600 h-72 rounded-xl overflow-hidden shadow-md">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-6">
            Hi, {vendorData?.name || 'Data is not available'}
          </h1>
          <div className="h-px w-24 bg-white/40" />
        </div>
      </div>

      {/* Profile Details */}
      <Card className="shadow-lg container">
        <CardHeader className="flex justify-between items-start p-6 pb-4">
          <h2 className="text-2xl font-semibold">Profile Details</h2>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Pencil className="w-4 h-4" />}
            onClick={() => {
              setEditDetails(vendorData);
              setIsEditModalOpen(true);
            }}
          >
            Edit Details
          </Button>
        </CardHeader>
        <CardBody className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Email Address" value={vendorData?.email} />
            <InfoItem label="Phone Number" value={vendorData?.mobile} />
            <InfoItem label="Address" value={vendorData?.address} />
          </div>
        </CardBody>
      </Card>

      {/* Edit Details Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fullWidth
        maxWidth="sm"

      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Edit Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label={!editDetails?.name ? 'Name' : undefined}
              placeholder="Enter name"
              value={editDetails?.name || ''}
              fullWidth
              onChange={(e) =>
                setEditDetails({ ...editDetails!, name: e.target.value })
              }
            />
            <TextField
              label={!editDetails?.email ? 'Email' : undefined}
              placeholder="Enter email"
              type="email"
              value={editDetails?.email || ''}
              fullWidth
              onChange={(e) =>
                setEditDetails({ ...editDetails!, email: e.target.value })
              }
            />
            <TextField
              label={!editDetails?.mobile ? 'Phone' : undefined}
              placeholder="Enter phone"
              type="tel"
              value={editDetails?.mobile || ''}
              fullWidth
              onChange={(e) =>
                setEditDetails({ ...editDetails!, mobile: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="text" color="error" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmitEditDetails}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="sm"

      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Add Address</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="House/Street Name"
              placeholder="Enter house/street name"
              value={address.house}
              onChange={(e) => setAddress({ ...address, house: e.target.value })}
              error={!!error.house}
              helperText={error.house}
            />
            <TextField
              label="Post"
              placeholder="Enter post"
              value={address.post}
              onChange={(e) => setAddress({ ...address, post: e.target.value })}
              error={!!error.post}
              helperText={error.post}
            />
            <TextField
              label="City"
              placeholder="Enter city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              error={!!error.city}
              helperText={error.city}
            />
            <TextField
              label="Pincode"
              placeholder="Enter pincode"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              error={!!error.pincode}
              helperText={error.pincode}
            />
            <TextField
              label="District"
              placeholder="Enter district"
              value={address.district}
              onChange={(e) => setAddress({ ...address, district: e.target.value })}
              error={!!error.district}
              helperText={error.district}
            />
            <TextField
              label="State"
              placeholder="Enter state"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              error={!!error.state}
              helperText={error.state}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="text" color="error" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: 'bold', borderRadius: 2, px: 3 }}
            onClick={handleAddAddress}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDetails;
