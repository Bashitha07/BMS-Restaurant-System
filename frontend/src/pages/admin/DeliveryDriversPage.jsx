import React from 'react';
import AdminDeliveryDrivers from '../../components/admin/AdminDeliveryDrivers';
import AdminLayout from '../../components/layouts/AdminLayout';

const DeliveryDriversPage = () => {
  return (
    <AdminLayout>
      <AdminDeliveryDrivers />
    </AdminLayout>
  );
};

export default DeliveryDriversPage;