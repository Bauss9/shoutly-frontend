import OrderStatusClient from './OrderStatusClient';

interface PageProps {
  params: {
    orderNumber: string;
  };
}

export default function OrderStatusPage({ params }: PageProps) {
  return <OrderStatusClient orderNumber={params.orderNumber} />;
}