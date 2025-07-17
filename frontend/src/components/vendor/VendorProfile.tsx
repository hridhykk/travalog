import React, { useEffect, useState } from 'react';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Pencil, Mail, Phone, MapPin, Building } from 'lucide-react';
import { RootState } from '../../redux/store';
import { showToastMessage } from "../../validation/Toast";
import { vendorAxios } from "../../Axiosconfig/Axiosconfig";

interface IVendor {
  _id?: string;
  name: string;
  email: string;
  mobile?: string;
  address: string;
  city: string;
  description: string;
  documents?: string;
  password: string;
  is_blocked?: boolean;
  is_Verified?: boolean;
}

interface IAPIResponse {
  status: string;
  message: string;
  Data: IVendor;
}

export const VendorDetails: React.FC = () => {
  const id = useSelector((state: RootState) => state.vendor.vendor?._id);
  const [vendorData, setVendorData] = useState<IVendor | null>(null);
  const [editedData, setEditedData] = useState<IVendor | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); 


  const fetchVendorData = async () => {
    try {
      setIsLoading(true);
    
      const response = await vendorAxios.get<IAPIResponse>(
     
        `/vendor/fetchdata`, { params: { id } } 
        
      );
  
      if (response.data.status === 'success') {
     
        setVendorData(response.data.Data);
        setEditedData(response.data.Data);
        //showToastMessage('Data fetched successfully', 'success');
      } else {
        showToastMessage(response.data.message, 'error');
      }
    } catch (error: any) {
      console.error('Error fetching vendor data:', error);
      showToastMessage(error.message || 'Error fetching vendor data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit vendor data
  const handleEditVendor = async () => {
    if (!editedData) return;

    // Validate all fields before submitting
    let valid = true;
    Object.entries(editedData).forEach(([key, value]) => {
      validateField(key as keyof IVendor, value as string);
      if (errors[key]) {
        valid = false;
      }
    });

    if (!valid) return;

    try {
      const response = await vendorAxios.post<IAPIResponse>(
        `/vendor/editvendor`, // Base URL
        {
          // The request body containing vendor data
          name: editedData.name,
          email: editedData.email,
          mobile: editedData.mobile,
          address: editedData.address,
          //description:editedData.description,
          city: editedData.city,
          is_blocked: editedData.is_blocked,
          is_Verified: editedData.is_Verified,
          description: editedData.description,
          password: editedData.password,
        },
        {
          params: { vendorId: id }, // Send vendorId as a query parameter
        }
      );
      
      

      if (response.data.status === 'success') {
        showToastMessage('Vendor details updated successfully', 'success');
        setIsOpen(false);
        // Refresh the data after successful edit
        fetchVendorData();
      } else {
        showToastMessage(response.data.message, 'error');
      }
    } catch (error: any) {
      console.error('Error updating vendor data:', error);
      showToastMessage(error.message || 'Error updating vendor data', 'error');
    }
  };

  // Handle input changes in the edit modal
  const handleInputChange = (field: keyof IVendor, value: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: value
      });
      validateField(field, value);
    }
  };
  const validateField = (field: keyof IVendor, value: string) => {
    let error = '';

    if (field === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value.trim())) {
        error = 'Invalid email address';
      }
    } else if (field === 'mobile') {
      const mobileRegex = /^(91)?0?[6-9]\d{9}$/;
      if (!mobileRegex.test(value.trim())) {
        error = 'Invalid mobile number';
      }
    } else if (field === 'city' && value.trim().length < 3) {
      error = 'City name must be at least 3 characters long';
    } else if (field === 'address' && value.trim().length < 10) {
      error = 'Address must be at least 10 characters long';
    } else if (field === 'description' && value.trim() && value.trim().length < 20) {
      error = 'Description must be at least 20 characters long';
    }

    // Set error for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  useEffect(() => {
    if (id) {
      fetchVendorData();
    }
  }, [id]);

  const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50/80 transition-colors">
      <div className="mt-1 text-gray-500">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-base text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }



  return (
    <div className="relative flex-1 mx-auto p-6 space-y-8" style={{ marginTop: '2cm' }}>
      {/* Hero Section */}
      <div className="relative h-72 rounded-xl overflow-hidden">
        <div className="absolute inset-0" />
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url("/bg.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-4xl font-bold mb-4">{vendorData?.name}</h1>
          <div className="h-px w-24 bg-white/30 mb-4" />
          <p className="text-lg text-center max-w-2xl text-white/90">
            {vendorData?.description}
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-start p-6">
          <div>
            <h2 className="text-2xl font-semibold">Profile Details</h2>
            <p className="text-sm text-gray-500">Manage your business information</p>
          </div>
          <Button 
            color="primary"
            variant="bordered"
            endContent={<Pencil className="w-4 h-4" />}
            onPress={() => setIsOpen(true)}
          >
            Edit Details
          </Button>
        </CardHeader>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              value={vendorData?.email || 'Not provided'}
            />
            <InfoItem
              icon={<Phone className="w-5 h-5" />}
              label="Phone Number"
              value={vendorData?.mobile || 'Not provided'}
            />
            <InfoItem
              icon={<Building className="w-5 h-5" />}
              label="City"
              value={vendorData?.city || 'Not provided'}
            />
            <InfoItem
              icon={<MapPin className="w-5 h-5" />}
              label="Address"
              value={vendorData?.address || 'Not provided'}
            />
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal with Backdrop */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
        className="z-50"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "bg-gray-100/80 border-gray-200 rounded-xl",
          body: "p-6 rounded-xl",
          header: "border-b-[8px] border-gray-200 rounded-xl",
          footer: "border-t-[1px] border-gray-200 rounded-xl",
          closeButton: "hover:bg-gray-100/80",
        }}
      >
         <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Vendor Details</ModalHeader>
              <ModalBody>
                <div>
                  <Input
                    
                    value={editedData?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    variant="bordered"
                    placeholder="Enter your email"
                    error={!!errors.email}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <Input
                  
                    value={editedData?.mobile || ''}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    variant="bordered"
                    placeholder="Enter your phone number"
                    error={!!errors.mobile}
                  />
                  {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>
                <div>
                  <Input
                   
                    value={editedData?.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    variant="bordered"
                    placeholder="Enter your city"
                    error={!!errors.city}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div>
                  <Input
                   
                    value={editedData?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    variant="bordered"
                    placeholder="Enter your address"
                    error={!!errors.address}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>
                <div>
                  <Textarea
                   
                    value={editedData?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    variant="bordered"
                    placeholder="Enter your business description"
                    minRows={3}
                    error={!!errors.description}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="success" onPress={handleEditVendor}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VendorDetails;