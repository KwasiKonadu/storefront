import { ContactRow } from '@/components/molecules';
import { CFG } from '@/lib/config';

export function ContactInfo() {
  return (
    <div className="contact-info">
      {CFG.pickup.enabled && <ContactRow icon="pin" title="Store & pickup address">{CFG.pickup.address}</ContactRow>}
      {CFG.address && !CFG.pickup.enabled && <ContactRow icon="pin" title="Address">{CFG.address}</ContactRow>}
      {CFG.hours && <ContactRow icon="clock" title="Opening hours">{CFG.hours}</ContactRow>}
      {CFG.email && <ContactRow icon="mail" title="Email">{CFG.email}</ContactRow>}
      {CFG.phone && <ContactRow icon="phone" title="Phone">{CFG.phone}</ContactRow>}
    </div>
  );
}
