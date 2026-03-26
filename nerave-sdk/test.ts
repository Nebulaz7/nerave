import { Nerave } from './src';

const nerave = new Nerave({
  apiKey: 'pk_test_9a87c1b60dee431188172e1b5962e9d6',
  baseUrl: 'http://localhost:5000',
});

async function run() {
  console.log('--- 1. List agreements ---');
  const agreements = await nerave.agreements.list();
  agreements.forEach(a => console.log(`${a.id} | ${a.status}`));

  console.log('\n--- 2. Initiate payment on PENDING agreement ---');
  const pendingId = '5cc47c8e-3297-4531-90ba-f66a9babd021';
  const payment = await nerave.payments.initiate(pendingId);
  console.log('Payment URL:', payment.paymentUrl);
  console.log('Ref:', payment.transactionReference);

  console.log('\n--- 3. Confirm milestone on FUNDED agreement ---');
  const fundedAgreementId = 'a9fa436c-633a-4bc7-b89c-6141b5063900';
  const milestoneId = '23b820bb-0dc6-4125-aa7b-d5328579f9c7';
  const confirmation = await nerave.milestones.confirm({
    agreementId: fundedAgreementId,
    milestoneId,
  });
  console.log('Confirmed:', confirmation);
}

run().catch(console.error);