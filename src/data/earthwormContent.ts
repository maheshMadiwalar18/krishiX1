export interface EarthwormTopic {
  id: string;
  title: { en: string; kn: string; };
  summary: { en: string; kn: string; };
  content: { en: string; kn: string; };
}

export interface EarthwormSection {
  id: string;
  title: { en: string; kn: string; };
  icon: string;
  topics: EarthwormTopic[];
}

export const EARTHWORM_DATA: EarthwormSection[] = [
  {
    id: 'govt-schemes',
    title: { en: 'Government Schemes', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' },
    icon: '🏛️',
    topics: [
      {
        id: 'pm-kisan',
        title: { en: 'PM-KISAN: Yearly Help', kn: 'ಪಿಎಂ-ಕಿಸಾನ್: ವಾರ್ಷಿಕ ಸಹಾಯ' },
        summary: { en: 'Get ₹6,000 every year directly in your bank account.', kn: 'ಪ್ರತಿ ವರ್ಷ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ₹6,000 ಪಡೆಯಿರಿ.' },
        content: {
          en: `
### Hello Farmer Friend,
If you are looking for a bit of extra help with your farm costs, the PM-KISAN scheme is made just for you. Think of it as a steady hand from the government to help you buy seeds or fertilizers when you need them most. Instead of running around for small loans, you get ₹6,000 every year, sent in three equal parts of ₹2,000.

### Is this for you?
Almost every farmer who owns even a small bit of land is eligible. Whether you grow rice, wheat, or vegetables, as long as the land is in your name, you can apply. However, if you have a big government job or a very high pension, this might not apply to you. It's really meant to help those who are working hard on their fields every day.

### How to get started?
You don't need to pay anyone to get this. Just go to the official website or your local CSC center. You will need your Aadhaar card and your bank passbook. Make sure the name on your land records matches your Aadhaar exactly.

### A Few Simple Tips:
- **Link Your Aadhaar**: This is the most important step. If your bank account isn't linked to your Aadhaar, the money won't arrive.
- **Check Your Phone**: Once you apply, you will get SMS updates. Keep an eye on them.
- **Update Your Land Info**: If you recently bought land or inherited it, update the records first, then apply.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ, ಕೃಷಿ ವೆಚ್ಚಗಳಿಗೆ ಸಹಾಯವಾಗಲೆಂದು ಸರ್ಕಾರ ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಯನ್ನು ತಂದಿದೆ. ಪ್ರತಿ ವರ್ಷ ಮೂರು ಕಂತುಗಳಲ್ಲಿ ಒಟ್ಟು ₹6,000 ನಿಮ್ಮ ಖಾತೆಗೆ ಬರುತ್ತದೆ. ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಜಮೀನು ಇದ್ದರೆ ನೀವು ಇದಕ್ಕೆ ಅರ್ಹರು. ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ಸರಿಯಾಗಿ ಲಿಂಕ್ ಮಾಡಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ಹತ್ತಿರದ ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರದಲ್ಲಿ ನೀವು ಸುಲಭವಾಗಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಬಹುದು.
          `,
          kn: `
### ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ,
ನಿಮ್ಮ ಕೃಷಿ ವೆಚ್ಚಗಳಿಗೆ ಸ್ವಲ್ಪ ಹೆಚ್ಚುವರಿ ಸಹಾಯ ಬೇಕಿದ್ದರೆ, ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ನಿಮಗಾಗಿ ಇದೆ. ಬಿತ್ತನೆ ಬೀಜ ಅಥವಾ ರಸಗೊಬ್ಬರಗಳನ್ನು ಖರೀದಿಸಲು ಇದು ಸರ್ಕಾರದ ಒಂದು ಪುಟ್ಟ ಸಹಾಯ ಎಂದು ಭಾವಿಸಿ. ಸಣ್ಣ ಸಾಲಗಳಿಗಾಗಿ ಅಲೆಯುವ ಬದಲು, ನೀವು ಪ್ರತಿ ವರ್ಷ ₹6,000 ಪಡೆಯುತ್ತೀರಿ, ಇದನ್ನು ತಲಾ ₹2,000 ರಂತೆ ಮೂರು ಭಾಗಗಳಲ್ಲಿ ನೀಡಲಾಗುತ್ತದೆ.

### ಇದು ನಿಮಗಾಗಿ ಇದೆಯೇ?
ಸಣ್ಣ ಪ್ರಮಾಣದ ಭೂಮಿಯನ್ನು ಹೊಂದಿರುವ ಪ್ರತಿಯೊಬ್ಬ ರೈತರೂ ಅರ್ಹರು. ಜಮೀನು ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿದ್ದರೆ ನೀವು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು. ಆದರೆ, ನೀವು ದೊಡ್ಡ ಸರ್ಕಾರಿ ಕೆಲಸದಲ್ಲಿದ್ದರೆ ಅಥವಾ ಹೆಚ್ಚಿನ ಪಿಂಚಣಿ ಪಡೆಯುತ್ತಿದ್ದರೆ ಇದು ಅನ್ವಯಿಸುವುದಿಲ್ಲ.

### ಪ್ರಾರಂಭಿಸುವುದು ಹೇಗೆ?
ಇದಕ್ಕಾಗಿ ನೀವು ಯಾರಿಗೂ ಹಣ ನೀಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಸ್ಥಳೀಯ ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರಕ್ಕೆ ಹೋಗಿ. ನಿಮಗೆ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಬೇಕಾಗುತ್ತದೆ.

### ಕೆಲವು ಸರಳ ಸಲಹೆಗಳು:
- **ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡಿ**: ಇದು ಬಹಳ ಮುಖ್ಯ. ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್ ಲಿಂಕ್ ಆಗದಿದ್ದರೆ ಹಣ ಬರುವುದಿಲ್ಲ.
- **ಫೋನ್ ಗಮನಿಸಿ**: ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ ನಂತರ ನಿಮಗೆ ಎಸ್‌ಎಂಎಸ್ ಬರುತ್ತದೆ, ಅದನ್ನು ಗಮನಿಸುತ್ತಿರಿ.
- **ಭೂ ದಾಖಲೆ ನವೀಕರಿಸಿ**: ಇತ್ತೀಚೆಗೆ ಜಮೀನು ಖರೀದಿಸಿದ್ದರೆ ದಾಖಲೆಗಳನ್ನು ನವೀಕರಿಸಿದ ನಂತರ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.
          `
        }
      },
      {
        id: 'enam',
        title: { en: 'e-NAM: Sell for Better Prices', kn: 'ಇ-ನಾಮ್: ಉತ್ತಮ ಬೆಲೆಗೆ ಮಾರಾಟ' },
        summary: { en: 'Sell your crops to buyers across India from your local mandi.', kn: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಂಡಿಯಿಂದಲೇ ಭಾರತದಾದ್ಯಂತ ಖರೀದಿದಾರರಿಗೆ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ.' },
        content: {
          en: `
### What is e-NAM?
Think of e-NAM as a big, digital marketplace. Instead of only showing your crops to 5 or 10 traders in your village market, you are now showing them to thousands of buyers across India. It helps you get the "True Value" for your hard work.

### How does it help you?
When you bring your bags to the market, they are tested for quality. They check how dry the grain is and how clean it is. This info goes online, and buyers from other cities bid for it. If a buyer in a far city likes your quality, they will pay a higher price than the local trader.

### Benefits:
- **Fair Price**: Since more people are bidding, you get a better price.
- **Direct Payment**: The money goes straight to your bank account. No waiting for cash.
- **Correct Weight**: Digital scales mean you won't be cheated on weight.

### Practical Tips:
1. **Clean Your Grain**: Take some time to remove stones and dust. Clean grain always gets a higher "Grade" and more money.
2. **Dry It Well**: If your crop is wet, buyers will offer less money. Sun-dry it properly before bringing it to the market.
3. **Register Early**: Go to your mandi office with your Aadhaar and Bank details to get your e-NAM farmer ID.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಇ-ನಾಮ್ ಎನ್ನುವುದು ಒಂದು ಡಿಜಿಟಲ್ ಮಾರುಕಟ್ಟೆ. ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಕೇವಲ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಿಗಳಿಗಲ್ಲದೆ ದೇಶದಾದ್ಯಂತ ಇರುವ ಖರೀದಿದಾರರಿಗೆ ತೋರಿಸಲು ಇದು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇದರಿಂದ ಸ್ಪರ್ಧೆ ಹೆಚ್ಚಾಗಿ ನಿಮಗೆ ಉತ್ತಮ ಬೆಲೆ ಸಿಗುತ್ತದೆ. ಹಣವು ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ. ಮಂಡಿಗೆ ತರುವ ಮೊದಲು ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಚೆನ್ನಾಗಿ ಶುಚಿಗೊಳಿಸಿ ಮತ್ತು ಒಣಗಿಸಿ, ಇದರಿಂದ ಹೆಚ್ಚಿನ ಬೆಲೆ ಪಡೆಯಬಹುದು.
          `,
          kn: `
### ಇ-ನಾಮ್ ಎಂದರೇನು?
ಇ-ನಾಮ್ ಎನ್ನುವುದನ್ನು ಒಂದು ದೊಡ್ಡ ಡಿಜಿಟಲ್ ಮಾರುಕಟ್ಟೆ ಎಂದು ಭಾವಿಸಿ. ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಕೇವಲ ನಿಮ್ಮ ಹಳ್ಳಿಯ 5 ಅಥವಾ 10 ವ್ಯಾಪಾರಿಗಳಿಗೆ ತೋರಿಸುವ ಬದಲು, ಈಗ ನೀವು ಅವುಗಳನ್ನು ಭಾರತದಾದ್ಯಂತ ಸಾವಿರಾರು ಖರೀದಿದಾರರಿಗೆ ತೋರಿಸುತ್ತಿದ್ದೀರಿ.

### ಇದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?
ನಿಮ್ಮ ಚೀಲಗಳನ್ನು ಮಾರುಕಟ್ಟೆಗೆ ತಂದಾಗ, ಅವುಗಳ ಗುಣಮಟ್ಟವನ್ನು ಪರೀಕ್ಷಿಸಲಾಗುತ್ತದೆ. ಈ ಮಾಹಿತಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಹೋಗುತ್ತದೆ ಮತ್ತು ಇತರ ನಗರಗಳ ಖರೀದಿದಾರರು ಅದಕ್ಕಾಗಿ ಬಿಡ್ ಮಾಡುತ್ತಾರೆ.

### ಪ್ರಯೋಜನಗಳು:
- **ನ್ಯಾಯಯುತ ಬೆಲೆ**: ಹೆಚ್ಚಿನ ಜನರು ಬಿಡ್ ಮಾಡುವುದರಿಂದ, ನಿಮಗೆ ಉತ್ತಮ ಬೆಲೆ ಸಿಗುತ್ತದೆ.
- **ನೇರ ಪಾವತಿ**: ಹಣವು ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹೋಗುತ್ತದೆ.
- **ಸರಿಯಾದ ತೂಕ**: ಡಿಜಿಟಲ್ ತೂಕದ ಯಂತ್ರಗಳಿಂದ ತೂಕದಲ್ಲಿ ಮೋಸವಾಗುವುದಿಲ್ಲ.

### ಪ್ರಾಯೋಗಿಕ ಸಲಹೆಗಳು:
1. **ಬೆಳೆ ಶುಚಿಗೊಳಿಸಿ**: ಕಲ್ಲು ಮತ್ತು ಧೂಳನ್ನು ತೆಗೆದುಹಾಕಿ. ಶುದ್ಧ ಧಾನ್ಯಕ್ಕೆ ಯಾವಾಗಲೂ ಹೆಚ್ಚಿನ ಬೆಲೆ ಸಿಗುತ್ತದೆ.
2. **ಚೆನ್ನಾಗಿ ಒಣಗಿಸಿ**: ನಿಮ್ಮ ಬೆಳೆ ಹಸಿಯಾಗಿದ್ದರೆ ಬೆಲೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಮಾರುಕಟ್ಟೆಗೆ ತರುವ ಮೊದಲು ಚೆನ್ನಾಗಿ ಒಣಗಿಸಿ.
3. **ಮೊದಲೇ ನೋಂದಾಯಿಸಿ**: ಇ-ನಾಮ್ ರೈತ ಐಡಿ ಪಡೆಯಲು ನಿಮ್ಮ ಆಧಾರ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳೊಂದಿಗೆ ಮಂಡಿ ಕಚೇರಿಗೆ ಹೋಗಿ.
          `
        }
      },
      {
        id: 'pm-fby',
        title: { en: 'PMFBY: Crop Insurance', kn: 'ಪಿಎಂಎಫ್‌ಬಿವೈ: ಬೆಳೆ ವಿಮೆ' },
        summary: { en: 'Protect your farm from losses caused by rain, drought, or pests.', kn: 'ಮಳೆ, ಬರ ಅಥವಾ ಕೀಟಗಳಿಂದ ಉಂಟಾಗುವ ನಷ್ಟದಿಂದ ನಿಮ್ಮ ಹೊಲವನ್ನು ರಕ್ಷಿಸಿ.' },
        content: {
          en: `
### Protection Against Nature
Farming is risky. Sometimes the rain doesn't come, or it comes too much. The Pradhan Mantri Fasal Bima Yojana (PMFBY) is like a shield for your pocket. If your crop is destroyed by natural reasons, the insurance company pays you for the loss.

### Low Cost, High Safety
For most food crops, you only pay a very small amount (2% of the value). The rest of the cost is paid by the government. It's a small price for the peace of mind that your family's future is safe even if the crop fails.

### Steps to Follow:
- **Apply with Sowing**: Usually, you apply for insurance at the time you buy seeds or start sowing.
- **Inform Quickly**: If a disaster happens, tell your bank or the insurance company within 72 hours. Don't wait too long.
- **Keep Records**: Take photos of the damaged field and keep your sowing certificate safe.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆಯು ಪ್ರಕೃತಿ ವಿಕೋಪಗಳಿಂದಾಗುವ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಪರಿಹಾರ ನೀಡುತ್ತದೆ. ರೈತರು ಕೇವಲ 2% ನಷ್ಟು ಸಣ್ಣ ವಿಮಾ ಕಂತು ಪಾವತಿಸಬೇಕಾಗುತ್ತದೆ. ಬೆಳೆ ಹಾನಿಯಾದ 72 ಗಂಟೆಗಳ ಒಳಗೆ ಅಧಿಕಾರಿಗಳಿಗೆ ಮಾಹಿತಿ ನೀಡುವುದು ಅತ್ಯಗತ್ಯ.
          `,
          kn: `
### ಪ್ರಕೃತಿಯ ವಿರುದ್ಧ ರಕ್ಷಣೆ
ಕೃಷಿಯು ಅಪಾಯಕಾರಿ. ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY) ನಿಮ್ಮ ಜೇಬಿಗೆ ರಕ್ಷಾಕವಚದಂತೆ. ನೈಸರ್ಗಿಕ ಕಾರಣಗಳಿಂದ ನಿಮ್ಮ ಬೆಳೆ ನಾಶವಾದರೆ, ವಿಮಾ ಕಂಪನಿಯು ನಿಮಗೆ ನಷ್ಟವನ್ನು ಪಾವತಿಸುತ್ತದೆ.
          `
        }
      },
      {
        id: 'soil-health',
        title: { en: 'Soil Health Card', kn: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್' },
        summary: { en: 'A "Report Card" for your soil to help you use the right fertilizer.', kn: 'ಸರಿಯಾದ ರಸಗೊಬ್ಬರವನ್ನು ಬಳಸಲು ಸಹಾಯ ಮಾಡುವ ನಿಮ್ಮ ಮಣ್ಣಿನ "ವರದಿ ಕಾರ್ಡ್".' },
        content: {
          en: `
### Know Your Soil
Just like a doctor tests your blood, the government tests your soil. The Soil Health Card tells you exactly what nutrients your field has and what it is missing. Most farmers use too much urea, which makes the soil hard. This card tells you the exact amount to use.

### Benefits:
- **Save Money**: You stop buying fertilizers that your soil doesn't need.
- **Better Yield**: When the soil gets the right food, the crops grow stronger and produce more.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ಗುಣಮಟ್ಟವನ್ನು ತಿಳಿಸುತ್ತದೆ. ವೈದ್ಯರು ರಕ್ತ ಪರೀಕ್ಷೆ ಮಾಡುವಂತೆ, ಸರ್ಕಾರವು ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಪರೀಕ್ಷಿಸಿ ಅದರಲ್ಲಿರುವ ಪೋಷಕಾಂಶಗಳ ಬಗ್ಗೆ ವರದಿ ನೀಡುತ್ತದೆ. ಇದರಿಂದ ಅನಗತ್ಯ ಗೊಬ್ಬರದ ವೆಚ್ಚ ಕಡಿಮೆಯಾಗುತ್ತದೆ.
          `,
          kn: `
### ನಿಮ್ಮ ಮಣ್ಣನ್ನು ತಿಳಿಯಿರಿ
ವೈದ್ಯರು ನಿಮ್ಮ ರಕ್ತವನ್ನು ಪರೀಕ್ಷಿಸುವಂತೆ, ಸರ್ಕಾರವು ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ. ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ನಿಮ್ಮ ಹೊಲದಲ್ಲಿ ಯಾವ ಪೋಷಕಾಂಶಗಳಿವೆ ಮತ್ತು ಯಾವುದು ಕಾಣೆಯಾಗಿದೆ ಎಂಬುದನ್ನು ನಿಖರವಾಗಿ ತಿಳಿಸುತ್ತದೆ.
          `
        }
      },
      {
        id: 'pm-kmy',
        title: { en: 'PM-KMY: Farmer Pension', kn: 'ಪಿಎಂ-ಕೆಎಂವೈ: ರೈತ ಪಿಂಚಣಿ' },
        summary: { en: 'Monthly pension of ₹3,000 for farmers after the age of 60.', kn: '60 ವರ್ಷ ದಾಟಿದ ರೈತರಿಗೆ ತಿಂಗಳಿಗೆ ₹3,000 ಪಿಂಚಣಿ.' },
        content: {
          en: `
### Security for Old Age
Farmers work hard all their lives. To ensure they have a dignified life when they get old, the PM Kisan Maandhan Yojana (PM-KMY) provides a monthly pension. Once you reach 60 years, you get ₹3,000 every month in your account.

### How it works:
You pay a small amount (like ₹55 to ₹200) every month depending on your age when you start. The government also pays the same amount for you. It's like a savings box for your future.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ವಯಸ್ಸಾದ ಮೇಲೆ ರೈತರಿಗೆ ಆರ್ಥಿಕ ಭದ್ರತೆ ನೀಡಲು ಈ ಪಿಂಚಣಿ ಯೋಜನೆ ಇದೆ. 60 ವರ್ಷ ತುಂಬಿದ ನಂತರ ರೈತರು ತಿಂಗಳಿಗೆ ₹3,000 ಪಿಂಚಣಿ ಪಡೆಯಬಹುದು. ಇದಕ್ಕಾಗಿ ರೈತರು ಪ್ರತಿ ತಿಂಗಳು ಸಣ್ಣ ಮೊತ್ತವನ್ನು ವಂತಿಗೆಯಾಗಿ ನೀಡಬೇಕಾಗುತ್ತದೆ.
          `,
          kn: `
### ವಯಸ್ಸಾದ ಕಾಲಕ್ಕೆ ಭದ್ರತೆ
ರೈತರು ಜೀವನ ಪೂರ್ತಿ ಕಷ್ಟಪಡುತ್ತಾರೆ. ಅವರು ವಯಸ್ಸಾದಾಗ ಘನತೆಯ ಜೀವನ ನಡೆಸುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು, ಈ ಯೋಜನೆ ತಿಂಗಳಿಗೆ ₹3,000 ಪಿಂಚಣಿ ನೀಡುತ್ತದೆ.
          `
        }
      }
    ]
  },
  {
    id: 'finance-loans',
    title: { en: 'Finance & Loans', kn: 'ಹಣಕಾಸು ಮತ್ತು ಸಾಲಗಳು' },
    icon: '💰',
    topics: [
      {
        id: 'kcc',
        title: { en: 'Kisan Credit Card (KCC)', kn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)' },
        summary: { en: 'A simple card to get low-interest loans for your farm.', kn: 'ಕಡಿಮೆ ಬಡ್ಡಿಯಲ್ಲಿ ಕೃಷಿ ಸಾಲ ಪಡೆಯಲು ಒಂದು ಸರಳ ಕಾರ್ಡ್.' },
        content: {
          en: `
### What is KCC?
A Kisan Credit Card (KCC) is like a helper in your pocket. It gives you a limit of money you can use whenever you need to buy seeds, fertilizers, or even fix your tractor. You don't have to go to the bank every single time you need a small amount.

### Why is it great?
The best part is the low interest. If you pay back the money on time, the interest can be as low as 4%. This is much, much cheaper than taking money from local moneylenders who might charge very high interest.

### How to use it?
It works like a regular bank card. You can withdraw money when the sowing season starts and pay it back after you sell your harvest. 

### Tips for You:
- **Pay on Time**: This is the secret. If you pay on time, the government gives you a discount on the interest.
- **Keep it Safe**: Treat it like your cash. Don't share your PIN with anyone.
- **Use for Farm Only**: Try to use this money only for farm needs so you can pay it back easily after harvest.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ನಿಮ್ಮ ಜೇಬಿನಲ್ಲಿರುವ ಸಹಾಯಕನಿದ್ದಂತೆ. ಬಿತ್ತನೆ ಬೀಜ, ಗೊಬ್ಬರ ಖರೀದಿಸಲು ಅಥವಾ ಕೃಷಿ ಕೆಲಸಗಳಿಗಾಗಿ ನೀವು ಈ ಕಾರ್ಡ್ ಬಳಸಿ ಸಾಲ ಪಡೆಯಬಹುದು. ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಹಣ ಮರುಪಾವತಿ ಮಾಡಿದರೆ ಕೇವಲ 4% ಬಡ್ಡಿದರ ಅನ್ವಯಿಸುತ್ತದೆ. ಇದು ಖಾಸಗಿ ಸಾಲಗಾರರಿಗಿಂತ ತುಂಬಾ ಅಗ್ಗವಾಗಿದೆ. ಪ್ರತಿ ಬೆಳೆಯ ಕೊಯ್ಲಿನ ನಂತರ ಹಣ ಮರುಪಾವತಿ ಮಾಡುವುದು ಉತ್ತಮ ಅಭ್ಯಾಸ.
          `,
          kn: `
### KCC ಎಂದರೇನು?
ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ನಿಮ್ಮ ಜೇಬಿನಲ್ಲಿರುವ ಸಹಾಯಕನಿದ್ದಂತೆ. ಬಿತ್ತನೆ ಬೀಜಗಳು, ರಸಗೊಬ್ಬರಗಳನ್ನು ಖರೀದಿಸಲು ಅಥವಾ ನಿಮ್ಮ ಟ್ರಾಕ್ಟರ್ ಅನ್ನು ಸರಿಪಡಿಸಲು ನಿಮಗೆ ಬೇಕಾದಾಗ ನೀವು ಹಣವನ್ನು ಬಳಸಬಹುದು.

### ಇದು ಏಕೆ ಉತ್ತಮ?
ಅತಿ ಕಡಿಮೆ ಬಡ್ಡಿ ಇದರ ವಿಶೇಷತೆ. ನೀವು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಹಣವನ್ನು ಮರುಪಾವತಿಸಿದರೆ, ಬಡ್ಡಿಯು 4% ರಷ್ಟು ಕಡಿಮೆಯಿರಬಹುದು.

### ಇದನ್ನು ಬಳಸುವುದು ಹೇಗೆ?
ಇದು ಸಾಮಾನ್ಯ ಬ್ಯಾಂಕ್ ಕಾರ್ಡ್‌ನಂತೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ. ಬಿತ್ತನೆ ಹಂಗಾಮು ಪ್ರಾರಂಭವಾದಾಗ ನೀವು ಹಣವನ್ನು ಹಿಂಪಡೆಯಬಹುದು ಮತ್ತು ಕೊಯ್ಲು ಮಾರಾಟ ಮಾಡಿದ ನಂತರ ಅದನ್ನು ಮರುಪಾವತಿಸಬಹುದು.

### ನಿಮಗಾಗಿ ಸಲಹೆಗಳು:
- **ಸಮಯಕ್ಕೆ ಪಾವತಿಸಿ**: ನೀವು ಸಮಯಕ್ಕೆ ಪಾವತಿಸಿದರೆ, ಸರ್ಕಾರವು ನಿಮಗೆ ಬಡ್ಡಿಯಲ್ಲಿ ರಿಯಾಯಿತಿ ನೀಡುತ್ತದೆ.
- **ಸುರಕ್ಷಿತವಾಗಿಡಿ**: ನಿಮ್ಮ ಪಿನ್ ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.
- **ಕೃಷಿಗಾಗಿ ಮಾತ್ರ ಬಳಸಿ**: ಈ ಹಣವನ್ನು ಕೃಷಿ ಅಗತ್ಯಗಳಿಗಾಗಿ ಮಾತ್ರ ಬಳಸಲು ಪ್ರಯತ್ನಿಸಿ.
          `
        }
      },
      {
        id: 'nabard',
        title: { en: 'NABARD Loans', kn: 'ನಬಾರ್ಡ್ ಸಾಲಗಳು' },
        summary: { en: 'Low interest loans for big farm projects.', kn: 'ದೊಡ್ಡ ಕೃಷಿ ಯೋಜನೆಗಳಿಗೆ ಕಡಿಮೆ ಬಡ್ಡಿ ಸಾಲಗಳು.' },
        content: {
          en: `
### What is NABARD?
NABARD is the main bank that helps other rural banks give loans to farmers. If you want to start a dairy farm, build a cold storage, or start a big agriculture business, NABARD has special schemes for you.

### How to get a loan?
You usually apply through your local cooperative or rural bank. They will check your plan and help you get the subsidy (money you don't have to pay back) from the government.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ನಬಾರ್ಡ್ ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿಗಾಗಿ ಇರುವ ಮುಖ್ಯ ಬ್ಯಾಂಕ್ ಆಗಿದೆ. ನೀವು ಹೈನುಗಾರಿಕೆ ಅಥವಾ ಶೈತ್ಯಾಗಾರಗಳನ್ನು ನಿರ್ಮಿಸಲು ಬಯಸಿದರೆ ನಬಾರ್ಡ್ ಮೂಲಕ ಸಹಾಯ ಪಡೆಯಬಹುದು. ಸ್ಥಳೀಯ ಸಹಕಾರ ಬ್ಯಾಂಕ್‌ಗಳ ಮೂಲಕ ನೀವು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.
          `,
          kn: `
### ನಬಾರ್ಡ್ ಎಂದರೇನು?
ನಬಾರ್ಡ್ ಎನ್ನುವುದು ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕುಗಳು ರೈತರಿಗೆ ಸಾಲ ನೀಡಲು ಸಹಾಯ ಮಾಡುವ ಮುಖ್ಯ ಬ್ಯಾಂಕ್ ಆಗಿದೆ. ನೀವು ಹೈನುಗಾರಿಕೆ ಪ್ರಾರಂಭಿಸಲು ಅಥವಾ ಶೈತ್ಯಾಗಾರವನ್ನು ನಿರ್ಮಿಸಲು ಬಯಸಿದರೆ, ನಬಾರ್ಡ್ ನಿಮಗಾಗಿ ವಿಶೇಷ ಯೋಜನೆಗಳನ್ನು ಹೊಂದಿದೆ.
          `
        }
      },
      {
        id: 'microfinance',
        title: { en: 'Microfinance', kn: 'ಕಿರು ಹಣಕಾಸು' },
        summary: { en: 'Small loans for small farmers and women groups.', kn: 'ಸಣ್ಣ ರೈತರು ಮತ್ತು ಮಹಿಳಾ ಗುಂಪುಗಳಿಗೆ ಸಣ್ಣ ಸಾಲಗಳು.' },
        content: {
          en: `
### Help for Small Needs
Microfinance is for farmers who only need a small amount of money, maybe ₹10,000 to ₹50,000. It is especially helpful for Self-Help Groups (SHGs) and women who want to start small businesses like goat rearing or tailoring alongside farming.

### Easy Access
Unlike big loans, microfinance requires very little paperwork. It's built on trust and group support. It helps you avoid the high-interest traps of local money lenders.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಸಣ್ಣ ಅಗತ್ಯಗಳಿಗಾಗಿ ಕಿರು ಹಣಕಾಸು ಸಾಲಗಳು ಲಭ್ಯವಿವೆ. ಇದು ವಿಶೇಷವಾಗಿ ಸ್ತ್ರೀಶಕ್ತಿ ಸಂಘಗಳು ಮತ್ತು ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಲು ಇಚ್ಛಿಸುವವರಿಗೆ ಸಹಕಾರಿ. ಇದಕ್ಕೆ ಹೆಚ್ಚಿನ ದಾಖಲೆಗಳ ಅವಶ್ಯಕತೆ ಇರುವುದಿಲ್ಲ.
          `,
          kn: `
### ಸಣ್ಣ ಅಗತ್ಯಗಳಿಗಾಗಿ ಸಹಾಯ
ಕಿರು ಹಣಕಾಸು ಎನ್ನುವುದು ಕೇವಲ ₹10,000 ರಿಂದ ₹50,000 ರಷ್ಟು ಸಣ್ಣ ಮೊತ್ತದ ಅಗತ್ಯವಿರುವ ರೈತರಿಗಾಗಿ ಇರುವ ಸೌಲಭ್ಯ.
          `
        }
      },
      {
        id: 'agri-clinics',
        title: { en: 'Agri-Clinics (AC&ABC)', kn: 'ಅಗ್ರಿ-ಕ್ಲಿನಿಕ್ ಯೋಜನೆ' },
        summary: { en: 'Loans to start your own agriculture service business.', kn: 'ನಿಮ್ಮ ಸ್ವಂತ ಕೃಷಿ ಸೇವಾ ವ್ಯವಹಾರವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಾಲಗಳು.' },
        content: {
          en: `
### Become an Agri-Entrepreneur
If you have studied agriculture or have good experience, this scheme helps you set up a clinic for farmers. You can provide services like soil testing, seed supply, or equipment rental and get a good income while helping your community.

### Subsidy Benefits
The government provides a massive subsidy (up to 44% for women and SC/ST) on these loans. It's a great way for young people in villages to stay connected to farming while building a business.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಕೃಷಿ ಪದವೀಧರರು ಅಥವಾ ಅನುಭವಿಗಳು ಈ ಯೋಜನೆಯಡಿ ಕೃಷಿ ಸೇವಾ ಕೇಂದ್ರಗಳನ್ನು ತೆರೆಯಬಹುದು. ಇದಕ್ಕಾಗಿ ಸರ್ಕಾರವು ಶೇ. 44 ರವರೆಗೆ ಸಬ್ಸಿಡಿ ನೀಡುತ್ತದೆ. ಇದು ಹಳ್ಳಿಯ ಯುವಕರಿಗೆ ಉತ್ತಮ ಉದ್ಯೋಗಾವಕಾಶ ನೀಡುತ್ತದೆ.
          `,
          kn: `
### ಕೃಷಿ ಉದ್ಯಮಿಯಾಗಲು ಸಹಾಯ
ನೀವು ಕೃಷಿ ಬಗ್ಗೆ ಅಧ್ಯಯನ ಮಾಡಿದ್ದರೆ ಅಥವಾ ಉತ್ತಮ ಅನುಭವ ಹೊಂದಿದ್ದರೆ, ರೈತರಿಗಾಗಿ ಕ್ಲಿನಿಕ್ ಸ್ಥಾಪಿಸಲು ಈ ಯೋಜನೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.
          `
        }
      },
      {
        id: 'interest-subvention',
        title: { en: 'Interest Subvention', kn: 'ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ಯೋಜನೆ' },
        summary: { en: 'How the government pays a part of your loan interest.', kn: 'ಸರ್ಕಾರವು ನಿಮ್ಮ ಸಾಲದ ಬಡ್ಡಿಯ ಒಂದು ಭಾಗವನ್ನು ಹೇಗೆ ಪಾವತಿಸುತ್ತದೆ.' },
        content: {
          en: `
### Lowering the Burden
The Interest Subvention Scheme is a hidden benefit for many farmers. The government pays 2% to 3% of the interest on your behalf to the bank. If you are a disciplined farmer who pays back on time, your interest can drop to almost zero in some states.

### Always Pay on Time
The only condition is "Timely Repayment". If you miss the date, you lose this benefit and have to pay the full interest. So, always prioritize your loan dues right after selling your crop.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ಯೋಜನೆಯಡಿ ಸರ್ಕಾರವು ನಿಮ್ಮ ಪರವಾಗಿ ಬ್ಯಾಂಕಿಗೆ ಶೇ. 2 ರಿಂದ 3 ರಷ್ಟು ಬಡ್ಡಿ ಪಾವತಿಸುತ್ತದೆ. ನೀವು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಸಾಲ ಮರುಪಾವತಿ ಮಾಡಿದರೆ ಬಡ್ಡಿಯ ಹೊರೆ ಬಹಳಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ.
          `,
          kn: `
### ಹೊರೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು
ಬಡ್ಡಿ ರಿಯಾಯಿತಿ ಯೋಜನೆಯು ಅನೇಕ ರೈತರಿಗೆ ಒಂದು ಗುಪ್ತ ಪ್ರಯೋಜನವಾಗಿದೆ. ಸರ್ಕಾರವು ನಿಮ್ಮ ಪರವಾಗಿ ಬ್ಯಾಂಕಿಗೆ ಶೇ. 2 ರಿಂದ 3 ರಷ್ಟು ಬಡ್ಡಿಯನ್ನು ಪಾವತಿಸುತ್ತದೆ.
          `
        }
      }
    ]
  },
  {
    id: 'sustainable-farming',
    title: { en: 'Sustainable Farming', kn: 'ಸುಸ್ಥಿರ ಕೃಷಿ' },
    icon: '🌱',
    topics: [
      {
        id: 'composting',
        title: { en: 'Making Your Own Compost', kn: 'ನಿಮ್ಮ ಸ್ವಂತ ಕಾಂಪೋಸ್ಟ್ ತಯಾರಿಕೆ' },
        summary: { en: 'Turn farm waste into "Black Gold" for your soil.', kn: 'ಕೃಷಿ ತ್ಯಾಜ್ಯವನ್ನು ನಿಮ್ಮ ಮಣ್ಣಿಗೆ "ಕಪ್ಪು ಚಿನ್ನ" ವಾಗಿ ಪರಿವರ್ತಿಸಿ.' },
        content: {
          en: `
### Why Compost?
Instead of burning your crop waste or throwing it away, you can turn it into powerful food for your soil. Chemical fertilizers make the soil hard over time, but compost (natural manure) makes it soft and helps it hold more water.

### Simple Steps:
1. **Dig a Pit**: Dig a small pit in a shaded corner of your farm.
2. **Layer Waste**: Throw in your crop waste, dry leaves, and some cow dung.
3. **Keep it Moist**: Sprinkle some water to keep it damp like a sponge.
4. **Wait**: In 3-4 months, it will turn into dark, rich soil.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಕೃಷಿ ತ್ಯಾಜ್ಯವನ್ನು ಸುಡುವ ಬದಲು ಅದನ್ನು ಗೊಬ್ಬರವಾಗಿ ಪರಿವರ್ತಿಸಿ. ಸಾವಯವ ಗೊಬ್ಬರವು ಮಣ್ಣನ್ನು ಮೃದುಗೊಳಿಸುತ್ತದೆ ಮತ್ತು ನೀರನ್ನು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ. ಒಂದು ಗುಂಡಿಯನ್ನು ಅಗೆದು ಅದರಲ್ಲಿ ಕೃಷಿ ತ್ಯಾಜ್ಯ ಮತ್ತು ಸಗಣಿಯನ್ನು ಹಾಕಿ 3-4 ತಿಂಗಳು ಬಿಟ್ಟರೆ ಉತ್ತಮ ಗೊಬ್ಬರ ತಯಾರಾಗುತ್ತದೆ.
          `,
          kn: `
### ಕಾಂಪೋಸ್ಟ್ ಏಕೆ?
ನಿಮ್ಮ ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ಸುಡುವ ಬದಲು, ನೀವು ಅದನ್ನು ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಶಕ್ತಿಯುತ ಆಹಾರವಾಗಿ ಪರಿವರ್ತಿಸಬಹುದು.
          `
        }
      },
      {
        id: 'natural-farming',
        title: { en: 'Natural Farming (ZBNF)', kn: 'ನೈಸರ್ಗಿಕ ಕೃಷಿ' },
        summary: { en: 'Farming with zero chemical costs and high yield.', kn: 'ಶೂನ್ಯ ರಾಸಾಯನಿಕ ವೆಚ್ಚ ಮತ್ತು ಹೆಚ್ಚಿನ ಇಳುವರಿಯೊಂದಿಗೆ ಕೃಷಿ.' },
        content: {
          en: `
### Zero Budget, High Health
Zero Budget Natural Farming (ZBNF) is about growing crops without buying anything from outside. No urea, no DAP, and no pesticides. It uses what is already available on your farm, like cow dung and urine.

### Key Pillars:
- **Jeevamrutha**: A mixture made from cow dung, urine, and jaggery that brings life to the soil.
- **Bijamrutha**: Natural treatment for seeds to prevent disease.
- **Mulching**: Covering the soil with crop waste to save water.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ನೈಸರ್ಗಿಕ ಕೃಷಿಯು ಯಾವುದೇ ರಾಸಾಯನಿಕಗಳಿಲ್ಲದ ಕೃಷಿ ಪದ್ಧತಿಯಾಗಿದೆ. ಇಲ್ಲಿ ಸಗಣಿ, ಗಂಜಲ ಮತ್ತು ಬೆಲ್ಲದಿಂದ ತಯಾರಿಸಿದ ಜೀವಾಮೃತವನ್ನು ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ. ಇದರಿಂದ ಕೃಷಿ ವೆಚ್ಚ ಶೂನ್ಯವಾಗುತ್ತದೆ.
          `,
          kn: `
### ಶೂನ್ಯ ಬಜೆಟ್ ಕೃಷಿ
ಶೂನ್ಯ ಬಜೆಟ್ ನೈಸರ್ಗಿಕ ಕೃಷಿ ಎನ್ನುವುದು ಮಾರುಕಟ್ಟೆಯಿಂದ ಏನನ್ನೂ ಖರೀದಿಸದೆ ಕೃಷಿ ಮಾಡುವುದಾಗಿದೆ. ಇದು ಜೀವಾಮೃತದ ಬಳಕೆಗೆ ಹೆಚ್ಚಿನ ಒತ್ತು ನೀಡುತ್ತದೆ.
          `
        }
      },
      {
        id: 'ipm',
        title: { en: 'Pest Management (IPM)', kn: 'ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣೆ' },
        summary: { en: 'Control pests using nature instead of poisons.', kn: 'ವಿಷಗಳ ಬದಲು ಪ್ರಕೃತಿಯನ್ನು ಬಳಸಿ ಕೀಟಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ.' },
        content: {
          en: `
### Be Smart with Pests
Integrated Pest Management (IPM) means you don't run for the poison spray as soon as you see a bug. Some bugs are actually friendly! They eat the bad bugs. IPM helps you balance the "good" and "bad" bugs on your farm.

### Practical Tips:
- **Yellow Traps**: Use yellow sticky cards to catch small pests.
- **Light Traps**: Use a light at night to attract and catch moths.
- **Neem Oil**: A safe and cheap way to keep many pests away without hurting the soil.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಕೀಟಗಳನ್ನು ಕಂಡ ತಕ್ಷಣ ವಿಷಕಾರಿ ಔಷಧ ಸಿಂಪಡಿಸುವ ಬದಲು ನೈಸರ್ಗಿಕ ವಿಧಾನಗಳನ್ನು ಅನುಸರಿಸಿ. ಹಳದಿ ಅಂಟಿನ ಬಲೆಗಳು ಮತ್ತು ಬೆಳಕಿನ ಬಲೆಗಳನ್ನು ಬಳಸುವ ಮೂಲಕ ಕೀಟಗಳನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ನಿಯಂತ್ರಿಸಬಹುದು. ಬೇವಿನ ಎಣ್ಣೆ ಅತ್ಯುತ್ತಮ ಮತ್ತು ಸುರಕ್ಷಿತ ಪರಿಹಾರವಾಗಿದೆ.
          `,
          kn: `
### ಕೀಟಗಳೊಂದಿಗೆ ಸ್ಮಾರ್ಟ್ ಆಗಿರಿ
ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣೆ ಎಂದರೆ ಕೀಟಗಳನ್ನು ಕಂಡ ತಕ್ಷಣ ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸುವುದಲ್ಲ. ಇದು ಮಿತ್ರ ಕೀಟಗಳನ್ನು ಉಳಿಸಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.
          `
        }
      },
      {
        id: 'crop-rotation',
        title: { en: 'Crop Rotation', kn: 'ಬೆಳೆ ಸರದಿ ಪದ್ಧತಿ' },
        summary: { en: 'Why you should never grow the same crop twice in a row.', kn: 'ಒಂದೇ ಬೆಳೆಯನ್ನು ಸತತವಾಗಿ ಏಕೆ ಬೆಳೆಯಬಾರದು?' },
        content: {
          en: `
### Give the Soil a Break
If you grow the same crop (like only cotton or only corn) every year, the soil gets tired. Certain pests also start living in the soil permanently. Crop rotation means changing the family of crops every season.

### How to Rotate:
After a heavy crop like wheat, grow a legume like moong or beans. These "magical" plants actually put nitrogen back into the soil, acting like a free fertilizer for your next crop.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಸತತವಾಗಿ ಒಂದೇ ಬೆಳೆಯನ್ನು ಬೆಳೆಯುವುದರಿಂದ ಮಣ್ಣು ತನ್ನ ಸತ್ವ ಕಳೆದುಕೊಳ್ಳುತ್ತದೆ. ಆದ್ದರಿಂದ ಬೆಳೆ ಸರದಿ ಪದ್ಧತಿಯನ್ನು ಅನುಸರಿಸಬೇಕು. ಒಂದು ಬಾರಿ ಏಕದಳ ಬೆಳೆ ಬೆಳೆದರೆ ಮುಂದಿನ ಬಾರಿ ದ್ವಿದಳ ಧಾನ್ಯಗಳನ್ನು ಬೆಳೆಯುವುದು ಮಣ್ಣಿನ ಆರೋಗ್ಯಕ್ಕೆ ಉತ್ತಮ.
          `,
          kn: `
### ಮಣ್ಣಿಗೆ ವಿಶ್ರಾಂತಿ ನೀಡಿ
ನೀವು ಪ್ರತಿ ವರ್ಷ ಒಂದೇ ಬೆಳೆಯನ್ನು ಬೆಳೆದರೆ ಮಣ್ಣು ದಣಿಯುತ್ತದೆ. ಬೆಳೆ ಸರದಿ ಎಂದರೆ ಪ್ರತಿ ಹಂಗಾಮಿನಲ್ಲೂ ಬೆಳೆಗಳ ವಿಧವನ್ನು ಬದಲಾಯಿಸುವುದು.
          `
        }
      },
      {
        id: 'mulching',
        title: { en: 'Mulching Secrets', kn: 'ಹೊದಿಕೆ ಕೃಷಿ (ಮಲ್ಚಿಂಗ್)' },
        summary: { en: 'Cover your soil to save water and stop weeds.', kn: 'ನೀರನ್ನು ಉಳಿಸಲು ಮತ್ತು ಕಳೆಗಳನ್ನು ತಡೆಯಲು ಮಣ್ಣನ್ನು ಮುಚ್ಚಿ.' },
        content: {
          en: `
### A Blanket for Your Field
Mulching is like putting a blanket over your soil. You can use dry straw, leaves, or even plastic sheets. It stops the sun from drying up the water in the soil, meaning you have to pump less water.

### Benefits:
- **No Weeds**: Weeds can't grow because they don't get sunlight.
- **Cool Roots**: It keeps the soil cool during hot summers, helping the plants grow better.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಮಲ್ಚಿಂಗ್ ಎಂದರೆ ಮಣ್ಣಿನ ಮೇಲೆ ಹೊದಿಕೆ ಹಾಕುವುದು. ಒಣಗಿದ ಎಲೆಗಳು ಅಥವಾ ಕಡ್ಡಿಗಳನ್ನು ಬಳಸಿ ಮಣ್ಣನ್ನು ಮುಚ್ಚುವುದರಿಂದ ನೀರು ಆವಿಯಾಗುವುದು ಕಡಿಮೆಯಾಗುತ್ತದೆ ಮತ್ತು ಕಳೆಗಳು ಬೆಳೆಯುವುದಿಲ್ಲ. ಇದು ಮಣ್ಣನ್ನು ತಂಪಾಗಿರಿಸುತ್ತದೆ.
          `,
          kn: `
### ಹೊಲಕ್ಕೆ ಒಂದು ಹೊದಿಕೆ
ಮಲ್ಚಿಂಗ್ ಎನ್ನುವುದು ಮಣ್ಣಿನ ಮೇಲೆ ಹೊದಿಕೆ ಹಾಕಿದಂತೆ. ಇದು ಸೂರ್ಯನ ಶಾಖದಿಂದ ನೀರು ಆವಿಯಾಗುವುದನ್ನು ತಡೆಯುತ್ತದೆ.
          `
        }
      },
      {
        id: 'rainwater-harvesting',
        title: { en: 'Rainwater Harvesting', kn: 'ಮಳೆನೀರು ಕೊಯ್ಲು' },
        summary: { en: 'Catch and save rainwater for the dry months.', kn: 'ಒಣಗಿದ ತಿಂಗಳುಗಳಿಗಾಗಿ ಮಳೆನೀರನ್ನು ಸಂಗ್ರಹಿಸಿ ಉಳಿಸಿ.' },
        content: {
          en: `
### Every Drop Counts
Rain is free water from the sky, but most of it runs off into the rivers. By digging a small pond (Krishi Bhagya scheme helps with this) or directing water to your borewell, you can save this water.

### Benefits:
- **Recharge Borewells**: The water goes deep into the ground, raising the water table.
- **Dry Season Supply**: When summer comes, you will still have water for your crops.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಮಳೆನೀರು ಉಚಿತವಾಗಿ ಸಿಗುವ ಸಂಪನ್ಮೂಲ. ಕೃಷಿ ಹೊಂಡಗಳನ್ನು ನಿರ್ಮಿಸುವ ಮೂಲಕ ಅಥವಾ ಬೋರ್‌ವೆಲ್‌ಗಳಿಗೆ ಮರುಪೂರಣ ಮಾಡುವ ಮೂಲಕ ಮಳೆನೀರನ್ನು ಸಂಗ್ರಹಿಸಬಹುದು. ಇದು ಅಂತರ್ಜಲ ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಬೇಸಿಗೆಯಲ್ಲಿ ಬೆಳೆಗಳಿಗೆ ನೀರು ಒದಗಿಸುತ್ತದೆ.
          `,
          kn: `
### ಪ್ರತಿ ಹನಿಯೂ ಮುಖ್ಯ
ಮಳೆನೀರು ಉಚಿತ ನೀರು, ಆದರೆ ಹೆಚ್ಚಿನವು ನದಿಗಳಿಗೆ ಹರಿದುಹೋಗುತ್ತದೆ. ಸಣ್ಣ ಹೊಂಡವನ್ನು ತೋಡುವ ಮೂಲಕ ಈ ನೀರನ್ನು ಉಳಿಸಬಹುದು.
          `
        }
      },
      {
        id: 'agroforestry',
        title: { en: 'Agroforestry', kn: 'ಕೃಷಿ ಅರಣ್ಯ' },
        summary: { en: 'Grow trees along with your crops for extra income.', kn: 'ಹೆಚ್ಚುವರಿ ಆದಾಯಕ್ಕಾಗಿ ಬೆಳೆಗಳ ಜೊತೆಗೆ ಮರಗಳನ್ನು ಬೆಳೆಸಿ.' },
        content: {
          en: `
### Trees are Friends
Planting useful trees (like Teak, Sandalwood, or fruit trees) on the borders of your farm doesn't stop your regular crops from growing. In fact, they act as a windbreak and protect your crops from strong winds.

### Long Term Wealth:
Think of these trees as a fixed deposit in the bank. After 10 or 15 years, selling the timber or fruits will give you a huge amount of money for things like building a house or a wedding.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ನಿಮ್ಮ ಜಮೀನಿನ ಬದುಗಳಲ್ಲಿ ತೇಗ, ಶ್ರೀಗಂಧ ಅಥವಾ ಹಣ್ಣಿನ ಮರಗಳನ್ನು ಬೆಳೆಸುವುದು ಉತ್ತಮ. ಇವು ಗಾಳಿತಡೆಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. 10-15 ವರ್ಷಗಳ ನಂತರ ಈ ಮರಗಳು ಬ್ಯಾಂಕ್ ಫಿಕ್ಸೆಡ್ ಡೆಪಾಸಿಟ್ ನಂತೆ ದೊಡ್ಡ ಮೊತ್ತದ ಆದಾಯವನ್ನು ನೀಡುತ್ತವೆ.
          `,
          kn: `
### ಮರಗಳು ನಮ್ಮ ಸ್ನೇಹಿತರು
ನಿಮ್ಮ ಹೊಲದ ಅಂಚುಗಳಲ್ಲಿ ಉಪಯುಕ್ತ ಮರಗಳನ್ನು (ತೇಗ, ಶ್ರೀಗಂಧದಂತಹ) ನೆಡುವುದು ನಿಮ್ಮ ನಿಯಮಿತ ಬೆಳೆಗಳನ್ನು ತಡೆಯುವುದಿಲ್ಲ.
          `
        }
      },
      {
        id: 'mixed-cropping',
        title: { en: 'Mixed Cropping', kn: 'ಮಿಶ್ರ ಬೆಳೆ ಪದ್ಧತಿ' },
        summary: { en: 'Grow two or more crops together to reduce risk.', kn: 'ಅಪಾಯವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಎರಡು ಅಥವಾ ಹೆಚ್ಚಿನ ಬೆಳೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ಬೆಳೆಯಿರಿ.' },
        content: {
          en: `
### Double Your Chances
Instead of planting only one type of crop, you plant two or more types together in the same field. If the weather is bad for one crop, the other crop might still survive. It's like not keeping all your eggs in one basket.

### Why it helps:
Different crops take different nutrients from the soil. Some, like legumes, even add nutrients that other crops need. It also makes it harder for pests to spread across the whole field.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಒಂದೇ ಬೆಳೆಯನ್ನು ಬೆಳೆಯುವ ಬದಲು ಎರಡು ಅಥವಾ ಹೆಚ್ಚಿನ ಬೆಳೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ಬೆಳೆಯುವುದು ಉತ್ತಮ. ಒಂದು ಬೆಳೆಗೆ ಹಾನಿಯಾದರೂ ಮತ್ತೊಂದು ಬೆಳೆ ಕೈಹಿಡಿಯುತ್ತದೆ. ವಿವಿಧ ಬೆಳೆಗಳು ಮಣ್ಣಿನ ವಿಭಿನ್ನ ಪೋಷಕಾಂಶಗಳನ್ನು ಬಳಸುವುದರಿಂದ ಮಣ್ಣಿನ ಆರೋಗ್ಯವೂ ಕಾಪಾಡಲ್ಪಡುತ್ತದೆ.
          `,
          kn: `
### ನಿಮ್ಮ ಅವಕಾಶಗಳನ್ನು ದ್ವಿಗುಣಗೊಳಿಸಿ
ಕೇವಲ ಒಂದು ರೀತಿಯ ಬೆಳೆಯನ್ನು ನೆಡುವ ಬದಲು, ನೀವು ಒಂದೇ ಹೊಲದಲ್ಲಿ ಎರಡು ಅಥವಾ ಹೆಚ್ಚಿನ ರೀತಿಯ ಬೆಳೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ನೆಡುತ್ತೀರಿ.
          `
        }
      }
    ]
  },
  {
    id: 'equipment',
    title: { en: 'Agricultural Equipment', kn: 'ಕೃಷಿ ಉಪಕರಣಗಳು' },
    icon: '🚜',
    topics: [
      {
        id: 'tractor-care',
        title: { en: 'Tractor Care', kn: 'ನಿಮ್ಮ ಟ್ರಾಕ್ಟರ್ ನಿರ್ವಹಣೆ' },
        summary: { en: 'Simple steps to keep your tractor running for a long time.', kn: 'ನಿಮ್ಮ ಟ್ರಾಕ್ಟರ್ ದೀರ್ಘಕಾಲ ಕೆಲಸ ಮಾಡಲು ಸರಳ ಹಂತಗಳು.' },
        content: {
          en: `
### Hello Friend,
A tractor is like the heart of your farm. If you take good care of it, it will save you a lot of manual labor and time. But if you ignore small problems, they can become very expensive repairs later on.

### Daily Check-up:
Before you start work in the morning, spend 5 minutes checking these:
- **Oil and Water**: Check if the engine oil and the water in the radiator are enough. Never run the engine if they are low.
- **Air Filter**: On a farm, there is a lot of dust. If the air filter is dirty, the tractor will drink more diesel. Clean it often.
- **Tires**: Check if there is enough air. Too little air can damage the tires, and too much air can make it slip in the mud.

### Saving Money:
If you have a small farm, you don't always need to buy a tractor. You can rent one from government centers at a low cost. This way, you get the work done without having a big loan on your head.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಟ್ರಾಕ್ಟರ್ ನಿಮ್ಮ ಹೊಲದ ಹೃದಯದಂತೆ. ಇದನ್ನು ಚೆನ್ನಾಗಿ ನೋಡಿಕೊಂಡರೆ ನಿಮ್ಮ ಸಮಯ ಮತ್ತು ಶ್ರಮ ಉಳಿಯುತ್ತದೆ. ಪ್ರತಿದಿನ ಕೆಲಸ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಇಂಜಿನ್ ಆಯಿಲ್ ಮತ್ತು ರೇಡಿಯೇಟರ್ ನೀರನ್ನು ಪರೀಕ್ಷಿಸಿ. ಏರ್ ಫಿಲ್ಟರ್ ಅನ್ನು ಆಗಾಗ್ಗೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ, ಇದರಿಂದ ಡೀಸೆಲ್ ಉಳಿತಾಯವಾಗುತ್ತದೆ. ನಿಮ್ಮದು ಸಣ್ಣ ಜಮೀನಾಗಿದ್ದರೆ, ಟ್ರಾಕ್ಟರ್ ಖರೀದಿಸುವ ಬದಲು ಬಾಡಿಗೆಗೆ ಪಡೆಯುವುದು ಉತ್ತಮ.
          `,
          kn: `
### ನಮಸ್ಕಾರ ಗೆಳೆಯರೇ,
ಟ್ರಾಕ್ಟರ್ ನಿಮ್ಮ ಹೊಲದ ಹೃದಯದಂತೆ. ನೀವು ಅದರ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸಿದರೆ, ಅದು ನಿಮಗೆ ಸಾಕಷ್ಟು ಶ್ರಮ ಮತ್ತು ಸಮಯವನ್ನು ಉಳಿಸುತ್ತದೆ.
          `
        }
      },
      {
        id: 'drip-irrigation',
        title: { en: 'Drip Maintenance', kn: 'ಹನಿ ನೀರಾವರಿ ನಿರ್ವಹಣೆ' },
        summary: { en: 'How to prevent your drip pipes from getting blocked.', kn: 'ನಿಮ್ಮ ಹನಿ ನೀರಾವರಿ ಪೈಪ್‌ಗಳು ಬ್ಲಾಕ್ ಆಗದಂತೆ ತಡೆಯುವುದು ಹೇಗೆ?' },
        content: {
          en: `
### Every Drop Counts
Drip irrigation is the best way to save water, but it has one common problem: the small holes (emitters) get blocked by salt or mud. If some plants get water and some don't, your harvest will be uneven.

### Practical Tips:
- **Flush the Lines**: Once a week, open the end-caps of the pipes and let the water run fast. This flushes out the mud.
- **Filter Cleaning**: Clean the main sand and screen filters every day before starting. A dirty filter reduces water pressure.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಹನಿ ನೀರಾವರಿ ಪೈಪ್‌ಗಳಲ್ಲಿ ಉಪ್ಪಿನಂಶ ಅಥವಾ ಮಣ್ಣು ತುಂಬಿಕೊಳ್ಳುವ ಸಾಧ್ಯತೆ ಇರುತ್ತದೆ. ಇದನ್ನು ತಡೆಯಲು ವಾರಕ್ಕೊಮ್ಮೆ ಪೈಪ್‌ಗಳ ಕೊನೆಯ ಮುಚ್ಚಳ ತೆರೆದು ನೀರು ಹರಿಸಬೇಕು. ಪ್ರತಿದಿನ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸುವುದು ಬಹಳ ಮುಖ್ಯ.
          `,
          kn: `
### ಪ್ರತಿ ಹನಿಯೂ ಮುಖ್ಯ
ಹನಿ ನೀರಾವರಿ ನೀರನ್ನು ಉಳಿಸಲು ಉತ್ತಮ ಮಾರ್ಗ. ಆದರೆ ಪೈಪ್‌ಗಳಲ್ಲಿನ ರಂಧ್ರಗಳು ಬ್ಲಾಕ್ ಆಗದಂತೆ ನೋಡಿಕೊಳ್ಳುವುದು ಅತ್ಯಗತ್ಯ.
          `
        }
      },
      {
        id: 'rotavator',
        title: { en: 'Rotavator Tips', kn: 'ರೋಟವೇಟರ್ ಬಳಕೆ' },
        summary: { en: 'Prepare your soil perfectly for the next crop.', kn: 'ಮುಂದಿನ ಬೆಳೆಗೆ ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಪರಿಪೂರ್ಣವಾಗಿ ಸಿದ್ಧಪಡಿಸಿ.' },
        content: {
          en: `
### Perfect Seed Bed
A rotavator is a powerful tool to break hard soil and mix crop waste. It replaces the work of plowing and harrowing. It makes the soil very fine, which is great for seeds to germinate.

### Safe Usage:
- **Check Blades**: Before using, check if all blades are tight. Loose blades can be dangerous.
- **Speed Matters**: Don't run the tractor too fast. A slow, steady speed gives a better finish to the soil.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ರೋಟವೇಟರ್ ಮಣ್ಣನ್ನು ಹದ ಮಾಡಲು ಮತ್ತು ಕೃಷಿ ತ್ಯಾಜ್ಯವನ್ನು ಮಣ್ಣಿನೊಳಗೆ ಬೆರೆಸಲು ಸಹಕಾರಿ. ಇದು ಉಳುಮೆಯ ಕೆಲಸವನ್ನು ಸುಲಭಗೊಳಿಸುತ್ತದೆ. ಬಳಕೆಗೆ ಮೊದಲು ಬ್ಲೇಡ್‌ಗಳು ಸರಿಯಾಗಿವೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸಿ. ಸ್ಥಿರ ವೇಗದಲ್ಲಿ ಟ್ರಾಕ್ಟರ್ ಚಾಲನೆ ಮಾಡಿ.
          `,
          kn: `
### ಪರಿಪೂರ್ಣ ಮಣ್ಣಿನ ಹದ
ರೋಟವೇಟರ್ ಗಟ್ಟಿಯಾದ ಮಣ್ಣನ್ನು ಒಡೆಯಲು ಮತ್ತು ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ಬೆರೆಸಲು ಒಂದು ಶಕ್ತಿಶಾಲಿ ಸಾಧನವಾಗಿದೆ.
          `
        }
      },
      {
        id: 'power-tiller',
        title: { en: 'Power Tillers', kn: 'ಪವರ್ ಟಿಲ್ಲರ್ ಬಳಕೆ' },
        summary: { en: 'The best friend for small farm owners.', kn: 'ಸಣ್ಣ ಜಮೀನು ಮಾಲೀಕರಿಗೆ ಉತ್ತಮ ಸ್ನೇಹಿತ.' },
        content: {
          en: `
### Small But Mighty
For farmers with less than 2 acres, a power tiller is much better than a big tractor. It is cheaper, uses less diesel, and can easily turn in small spaces where a big tractor cannot reach.

### Maintenance:
Keep the engine clean and check the transmission oil regularly. Since it's a smaller machine, it needs more frequent greasing of the moving parts.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಸಣ್ಣ ರೈತರಿಗೆ ಪವರ್ ಟಿಲ್ಲರ್ ಬಹಳ ಉಪಯುಕ್ತ. ಇದು ಕಡಿಮೆ ಡೀಸೆಲ್ ಬಳಸುತ್ತದೆ ಮತ್ತು ಸಣ್ಣ ಜಾಗಗಳಲ್ಲಿ ಸುಲಭವಾಗಿ ಚಲಿಸುತ್ತದೆ. ಇದರ ನಿರ್ವಹಣೆ ಸುಲಭ ಮತ್ತು ವೆಚ್ಚವೂ ಕಡಿಮೆ.
          `,
          kn: `
### ಸಣ್ಣದಾದರೂ ಶಕ್ತಿಶಾಲಿ
2 ಎಕರೆಗಿಂತ ಕಡಿಮೆ ಜಮೀನು ಹೊಂದಿರುವ ರೈತರಿಗೆ ಪವರ್ ಟಿಲ್ಲರ್ ದೊಡ್ಡ ಟ್ರಾಕ್ಟರ್‌ಗಿಂತ ಉತ್ತಮ ಆಯ್ಕೆಯಾಗಿದೆ.
          `
        }
      },
      {
        id: 'seed-drill',
        title: { en: 'Seed Drills', kn: 'ಬಿತ್ತನೆ ಯಂತ್ರ (ಸೀಡ್ ಡ್ರಿಲ್)' },
        summary: { en: 'Save seeds and ensure perfect spacing for your crops.', kn: 'ಬೀಜಗಳನ್ನು ಉಳಿಸಿ ಮತ್ತು ಬೆಳೆಗಳ ನಡುವೆ ಸರಿಯಾದ ಅಂತರವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.' },
        content: {
          en: `
### Precision Sowing
Instead of throwing seeds by hand, a seed drill places them at the exact depth and distance. This means every seed has a high chance of growing, and you don't waste expensive seeds.

### Why it helps:
When plants have equal space, they don't fight for water and food. They grow bigger and stronger. It also makes weeding much easier later on because the plants are in straight rows.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ಕೈಯಿಂದ ಬೀಜ ಚೆಲ್ಲುವ ಬದಲು ಬಿತ್ತನೆ ಯಂತ್ರ ಬಳಸುವುದು ಉತ್ತಮ. ಇದು ಬೀಜಗಳನ್ನು ಸರಿಯಾದ ಆಳ ಮತ್ತು ಅಂತರದಲ್ಲಿ ಬಿತ್ತಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇದರಿಂದ ಬೀಜಗಳ ಪೋಲು ಕಡಿಮೆಯಾಗುತ್ತದೆ ಮತ್ತು ಇಳುವರಿ ಹೆಚ್ಚುತ್ತದೆ.
          `,
          kn: `
### ನಿಖರವಾದ ಬಿತ್ತನೆ
ಬೀಜಗಳನ್ನು ಕೈಯಿಂದ ಎಸೆಯುವ ಬದಲು, ಬಿತ್ತನೆ ಯಂತ್ರವು ಅವುಗಳನ್ನು ನಿಖರವಾದ ಆಳ ಮತ್ತು ಅಂತರದಲ್ಲಿ ಇರಿಸುತ್ತದೆ.
          `
        }
      },
      {
        id: 'solar-pumps',
        title: { en: 'Solar Water Pumps', kn: 'ಸೌರಶಕ್ತಿ ಪಂಪ್‌ಗಳು' },
        summary: { en: 'Run your water pumps for free using the sun.', kn: 'ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸಿ ಉಚಿತವಾಗಿ ನೀರಿನ ಪಂಪ್‌ಗಳನ್ನು ಚಲಾಯಿಸಿ.' },
        content: {
          en: `
### Free Energy
Tired of waiting for electricity or paying for expensive diesel? Solar water pumps use sunlight to pump water. Once you install it, the daily cost of running the pump is zero.

### Government Subsidies:
Under the PM-KUSUM scheme, the government provides huge subsidies (up to 60-90%) to farmers for installing solar pumps. It's a one-time investment that pays off for years.

### ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Version)
ವಿದ್ಯುತ್ ಕಡಿತ ಅಥವಾ ಡೀಸೆಲ್ ಬೆಲೆಯ ಬಗ್ಗೆ ಚಿಂತಿಸುವ ಅಗತ್ಯವಿಲ್ಲ. ಸೌರಶಕ್ತಿ ಪಂಪ್‌ಗಳು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸಿ ಉಚಿತವಾಗಿ ನೀರು ಒದಗಿಸುತ್ತವೆ. ಪಿಎಂ-ಕುಸುಮ್ ಯೋಜನೆಯಡಿ ಸರ್ಕಾರವು ಸೌರ ಪಂಪ್‌ಗಳನ್ನು ಅಳವಡಿಸಲು ಶೇ. 60-90 ರಷ್ಟು ಸಹಾಯಧನ ನೀಡುತ್ತದೆ.
          `,
          kn: `
### ಉಚಿತ ಶಕ್ತಿ
ವಿದ್ಯುತ್‌ಗಾಗಿ ಕಾಯಲು ಅಥವಾ ದುಬಾರಿ ಡೀಸೆಲ್‌ಗೆ ಪಾವತಿಸಲು ಸುಸ್ತಾಗಿದ್ದೀರಾ? ಸೌರ ನೀರಿನ ಪಂಪ್‌ಗಳು ನೀರನ್ನು ಪಂಪ್ ಮಾಡಲು ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸುತ್ತವೆ.
          `
        }
      }
    ]
  }
];
