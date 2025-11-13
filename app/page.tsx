'use client';

import { useState, useEffect } from 'react';

// Define tuition rates by campus and grade tier
const tuitionRates = {
  north: {
    'k4-5': 13000,
    '6-8': 15000,
    '9-12': 18000
  },
  south: {
    'k4-5': 11000,
    '6-8': 13000,
    '9-12': 15000
  }
};

// Map individual grades to rate tiers
function getGradeTier(grade: string): string | null {
  const k4_5_grades = ['k4', 'k5', '1st', '2nd', '3rd', '4th', '5th'];
  const six_eight_grades = ['6th', '7th', '8th'];
  const nine_twelve_grades = ['9th', '10th', '11th', '12th'];
  
  if (k4_5_grades.includes(grade)) {
    return 'k4-5';
  } else if (six_eight_grades.includes(grade)) {
    return '6-8';
  } else if (nine_twelve_grades.includes(grade)) {
    return '9-12';
  }
  return null;
}

// Function to format grade for display
function formatGradeDisplay(grade: string): string {
  const gradeDisplayMap: Record<string, string> = {
    'k4': 'K4',
    'k5': 'K5', 
    '1st': '1st',
    '2nd': '2nd',
    '3rd': '3rd',
    '4th': '4th',
    '5th': '5th',
    '6th': '6th',
    '7th': '7th',
    '8th': '8th',
    '9th': '9th',
    '10th': '10th',
    '11th': '11th',
    '12th': '12th'
  };
  return gradeDisplayMap[grade] || grade;
}

// Define income thresholds for Milwaukee residents
const milwaukeeThresholds = {
  1: { poverty: 15650, mpcp: 46950, cat3: 62600, cat4: 78250, cat5: 93900, cat6: 109550 },
  2: { poverty: 21150, mpcp: 63450, cat3: 84600, cat4: 105750, cat5: 126900, cat6: 148050 },
  3: { poverty: 26650, mpcp: 79950, cat3: 106600, cat4: 133250, cat5: 159900, cat6: 186550 },
  4: { poverty: 32150, mpcp: 96450, cat3: 128600, cat4: 160750, cat5: 192900, cat6: 225050 },
  5: { poverty: 37650, mpcp: 112950, cat3: 150600, cat4: 188250, cat5: 225900, cat6: 263550 },
  6: { poverty: 43150, mpcp: 129450, cat3: 172600, cat4: 215750, cat5: 258900, cat6: 302050 },
  7: { poverty: 48650, mpcp: 145950, cat3: 194600, cat4: 243250, cat5: 291900, cat6: 340550 },
  8: { poverty: 54150, mpcp: 162450, cat3: 216600, cat4: 270750, cat5: 324900, cat6: 379050 },
  9: { poverty: 59650, mpcp: 178950, cat3: 238600, cat4: 298250, cat5: 357900, cat6: 417550 },
  10: { poverty: 65150, mpcp: 195450, cat3: 260600, cat4: 325750, cat5: 390900, cat6: 456050 }
};

// Define income thresholds for non-Milwaukee residents
const nonMilwaukeeThresholds = {
  1: { poverty: 15650, mpcp: 34430, cat3: 62600, cat4: 78250, cat5: 93900, cat6: 109550 },
  2: { poverty: 21150, mpcp: 46530, cat3: 84600, cat4: 105750, cat5: 126900, cat6: 148050 },
  3: { poverty: 26650, mpcp: 58630, cat3: 106600, cat4: 133250, cat5: 159900, cat6: 186550 },
  4: { poverty: 32150, mpcp: 70730, cat3: 128600, cat4: 160750, cat5: 192900, cat6: 225050 },
  5: { poverty: 37650, mpcp: 82830, cat3: 150600, cat4: 188250, cat5: 225900, cat6: 263550 },
  6: { poverty: 43150, mpcp: 94930, cat3: 172600, cat4: 215750, cat5: 258900, cat6: 302050 },
  7: { poverty: 48650, mpcp: 107030, cat3: 194600, cat4: 243250, cat5: 291900, cat6: 340550 },
  8: { poverty: 54150, mpcp: 119130, cat3: 216600, cat4: 270750, cat5: 324900, cat6: 379050 },
  9: { poverty: 59650, mpcp: 131230, cat3: 238600, cat4: 298250, cat5: 357900, cat6: 417550 },
  10: { poverty: 65150, mpcp: 143330, cat3: 260600, cat4: 325750, cat5: 390900, cat6: 456050 }
};

// Define discount percentages and categories
const discountInfo = {
  category1: { percentage: 100, name: "Voucher Program Eligible", isChoice: true },
  category2: { percentage: 40, name: "40% Tuition Discount", isChoice: false },
  category3: { percentage: 30, name: "30% Tuition Discount", isChoice: false },
  category4: { percentage: 20, name: "20% Tuition Discount", isChoice: false },
  category5: { percentage: 10, name: "10% Tuition Discount", isChoice: false },
  category6: { percentage: 0, name: "Standard Tuition Rate", isChoice: false },
  beyond: { percentage: 0, name: "Standard Tuition Rate", isChoice: false }
};

type DiscountCategory = keyof typeof discountInfo;

function determineDiscountCategory(isMilwaukee: boolean, householdSize: number, income: number): DiscountCategory {
  const thresholds = isMilwaukee ? milwaukeeThresholds[householdSize as keyof typeof milwaukeeThresholds] : nonMilwaukeeThresholds[householdSize as keyof typeof nonMilwaukeeThresholds];
  
  if (!thresholds) return 'beyond';
  
  if (income <= thresholds.mpcp) {
    return 'category1';
  } else if (income <= thresholds.cat3) {
    return 'category2';
  } else if (income <= thresholds.cat4) {
    return 'category3';
  } else if (income <= thresholds.cat5) {
    return 'category4';
  } else if (income <= thresholds.cat6) {
    return 'category5';
  } else {
    return 'category6';
  }
}

function checkMarriageAdjustment(isMilwaukee: boolean, householdSize: number, income: number): boolean {
  const thresholds = isMilwaukee ? milwaukeeThresholds[householdSize as keyof typeof milwaukeeThresholds] : nonMilwaukeeThresholds[householdSize as keyof typeof nonMilwaukeeThresholds];
  
  if (!thresholds) return false;
  
  const choiceLimit = thresholds.mpcp;
  
  return income > choiceLimit && income <= (choiceLimit + 7000);
}

export default function TuitionCalculator() {
  const [campus, setCampus] = useState('');
  const [milwaukee, setMilwaukee] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [siblingDiscount, setSiblingDiscount] = useState(false);
  
  const [showError, setShowError] = useState(false);
  const [showGradeWarning, setShowGradeWarning] = useState(false);
  const [showMarriageNote, setShowMarriageNote] = useState(false);
  const [marriageNoteText, setMarriageNoteText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showPaymentPlans, setShowPaymentPlans] = useState(false);
  
  const [results, setResults] = useState({
    baseTuition: 0,
    foundingFamiliesAmount: 0,
    siblingDiscountAmount: 0,
    financialAidPercentage: 0,
    financialAidAmount: 0,
    finalTuition: 0,
    isChoice: false,
    showFoundingFamilies: false,
    showSiblingDiscount: false,
    showFinancialAid: false,
    infoText: '',
    infoClass: '',
    finalTuitionLabel: '',
    fullPayment: 0,
    quarterlyPayment: 0,
    monthlyPayment: 0
  });

  useEffect(() => {
    checkGradeAvailability();
  }, [campus, gradeLevel]);

  const checkGradeAvailability = () => {
    const phasedGrades = ['7th', '8th', '10th', '11th', '12th'];
    
    if (campus === 'north' && phasedGrades.includes(gradeLevel)) {
      setShowGradeWarning(true);
    } else {
      setShowGradeWarning(false);
    }
  };

  const calculateTuition = () => {
    setShowError(false);
    setShowMarriageNote(false);

    const income = parseFloat(annualIncome);
    const houseSize = parseInt(householdSize);

    if (!campus || !milwaukee || !householdSize || annualIncome === '' || isNaN(income) || income < 0 || !gradeLevel) {
      setShowError(true);
      setShowResults(false);
      return;
    }

    const gradeTier = getGradeTier(gradeLevel);
    if (!gradeTier) {
      setShowError(true);
      setShowResults(false);
      return;
    }

    const baseTuition = tuitionRates[campus as keyof typeof tuitionRates][gradeTier as keyof typeof tuitionRates.north];
    
    let currentBalance = baseTuition;
    
    let foundingFamiliesDiscountAmount = 0;
    if (campus === 'north') {
      foundingFamiliesDiscountAmount = currentBalance * 0.10;
      currentBalance = currentBalance - foundingFamiliesDiscountAmount;
    }
    
    let siblingDiscountAmount = 0;
    if (siblingDiscount) {
      siblingDiscountAmount = currentBalance * 0.10;
      currentBalance = currentBalance - siblingDiscountAmount;
    }
    
    const isMilwaukee = milwaukee === 'yes';
    const category = determineDiscountCategory(isMilwaukee, houseSize, income);
    const discount = discountInfo[category];
    
    const nearChoiceLimit = checkMarriageAdjustment(isMilwaukee, houseSize, income);
    if (nearChoiceLimit) {
      const thresholds = isMilwaukee ? milwaukeeThresholds[houseSize as keyof typeof milwaukeeThresholds] : nonMilwaukeeThresholds[houseSize as keyof typeof nonMilwaukeeThresholds];
      const choiceLimit = thresholds.mpcp;
      const programName = isMilwaukee ? 'Milwaukee Parental Choice Program (MPCP)' : 'Wisconsin Parental Choice Program (WPCP)';
      const adjustedIncome = income - 7000;
      
      setMarriageNoteText(`Your current income of $${income.toLocaleString()} is just above the ${programName} limit of $${choiceLimit.toLocaleString()}. The Choice program provides a $7,000 income adjustment for married couples. This means if you are married, you should re-run this calculator with an adjusted income of $${adjustedIncome.toLocaleString()} (your actual income minus $7,000) to see if you qualify for the Choice program, which would result in no tuition charges if awarded a Choice scholarship.`);
      setShowMarriageNote(true);
    }
    
    let financialAidAmount = 0;
    if (discount.percentage > 0 && !discount.isChoice) {
      financialAidAmount = currentBalance * (discount.percentage / 100);
      currentBalance = currentBalance - financialAidAmount;
    }
    
    const finalTuition = currentBalance;

    let infoText = '';
    let infoClass = 'discount-info';
    
    if (discount.isChoice) {
      const programName = isMilwaukee ? 'Milwaukee Parental Choice Program (MPCP)' : 'Wisconsin Parental Choice Program (WPCP)';
      infoText = `<strong>Excellent news!</strong> Based on your income and household size, your family qualifies for the ${programName}. <strong>Students awarded a Choice scholarship pay no tuition.</strong> You will need to apply for the Choice program separately and acceptance is subject to available seats and income verification.`;
      infoClass = 'choice-program';
    } else if (discount.percentage > 0 || siblingDiscount || campus === 'north') {
      let discountText = '';
      if (discount.percentage > 0) {
        discountText = `<strong>You likely qualify for a ${discount.percentage}% financial aid award</strong> based on your household size and income level.`;
      }
      if (siblingDiscount) {
        const siblingText = discount.percentage > 0 ? ' Additionally, you qualify for a <strong>10% sibling discount</strong> since you have other children enrolling at St. Augustine Preparatory Academy.' : '<strong>You qualify for a 10% sibling discount</strong> since you have other children enrolling at St. Augustine Preparatory Academy.';
        discountText += siblingText;
      }
      if (campus === 'north') {
        const foundingText = (discount.percentage > 0 || siblingDiscount) ? ' Your family also receives the <strong>10% Founding Families discount</strong> automatically included with Aug Prep North for our inaugural year.' : '<strong>Your family receives the 10% Founding Families discount</strong> automatically included with Aug Prep North for our inaugural year.';
        discountText += foundingText;
      }
      discountText += ' This is an estimate and actual discount may vary based on income verification.<br><br>';
      discountText += '<strong>Aug Prep is committed to making a high-quality, Christ-centered education accessible to families.</strong> Additional grants and financial assistance may be available beyond what is shown above. <strong><a href="https://www.augprep.org/apps/pages/admissions/connect" target="_blank">Complete this short form</a></strong>, and a member of our team will reach out to discuss personalized options and answer any questions you may have.';
      infoText = discountText;
    } else {
      infoText = 'Based on your estimated household income and size, you would likely qualify for our standard tuition rate. This is an estimate and actual tuition may vary.<br><br>';
      infoText += '<strong>Aug Prep is committed to making a high-quality, Christ-centered education accessible to families.</strong> Additional grants and financial assistance may be available beyond what is shown above. <strong><a href="https://www.augprep.org/apps/pages/admissions/connect" target="_blank">Complete this short form</a></strong>, and a member of our team will reach out to discuss personalized options and answer any questions you may have.';
    }

    const deposit = 500;
    const remainingBalance = Math.max(0, finalTuition - deposit);
    const fullPaymentDiscount = remainingBalance * 0.05;
    const fullPayment = remainingBalance - fullPaymentDiscount;
    const quarterlyPayment = Math.round(remainingBalance / 4);
    const monthlyPayment = Math.round(remainingBalance / 10);

    setResults({
      baseTuition,
      foundingFamiliesAmount: foundingFamiliesDiscountAmount,
      siblingDiscountAmount,
      financialAidPercentage: discount.percentage,
      financialAidAmount,
      finalTuition,
      isChoice: discount.isChoice,
      showFoundingFamilies: campus === 'north',
      showSiblingDiscount: siblingDiscount,
      showFinancialAid: discount.percentage > 0,
      infoText,
      infoClass,
      finalTuitionLabel: `Estimated Annual Tuition for your ${formatGradeDisplay(gradeLevel)} grade child:`,
      fullPayment,
      quarterlyPayment,
      monthlyPayment
    });

    setShowResults(true);
    setShowPaymentPlans(!discount.isChoice);

    setTimeout(() => {
      if (nearChoiceLimit) {
        document.getElementById('marriageNote')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="calculator-container">
      <div className="header">
        <h1>Tuition Estimator</h1>
        <p>Estimate your family&apos;s tuition cost based on income and residency</p>
        <p><strong>2026-2027 School Year</strong></p>
        <div className="disclaimer">
          <strong>Important:</strong> This is an estimate only and not guaranteed. Actual tuition may vary based on verification of income, family size, and program eligibility. Please contact our office for final tuition determination.
        </div>
      </div>
      
      <div className="form-container">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="campus">Select Campus</label>
            <select id="campus" value={campus} onChange={(e) => setCampus(e.target.value)} required>
              <option value="">Select...</option>
              <option value="north">Aug Prep North</option>
              <option value="south">Aug Prep South</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="milwaukee">Do you live in the City of Milwaukee?</label>
            <select id="milwaukee" value={milwaukee} onChange={(e) => setMilwaukee(e.target.value)} required>
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="householdSize">Household Size</label>
            <select id="householdSize" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} required>
              <option value="">Select...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="annualIncome">Annual Household Income</label>
            <input 
              type="number" 
              id="annualIncome" 
              placeholder="Enter your annual income" 
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              required 
              min="0" 
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gradeLevel">Student Grade Level</label>
            <select id="gradeLevel" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} required>
              <option value="">Select...</option>
              <option value="k4">K4 (4-year-old Kindergarten)</option>
              <option value="k5">K5 (5-year-old Kindergarten)</option>
              <option value="1st">1st Grade</option>
              <option value="2nd">2nd Grade</option>
              <option value="3rd">3rd Grade</option>
              <option value="4th">4th Grade</option>
              <option value="5th">5th Grade</option>
              <option value="6th">6th Grade</option>
              <option value="7th">7th Grade</option>
              <option value="8th">8th Grade</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                id="siblingDiscount"
                checked={siblingDiscount}
                onChange={(e) => setSiblingDiscount(e.target.checked)}
              />
              <span className="checkbox-text">Other siblings will also be enrolling at St. Augustine Preparatory Academy</span>
            </label>
            <div className="form-note">Check this box if you have other children who will also be students at St. Augustine Preparatory Academy. This qualifies you for an additional 10% sibling discount.</div>
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateTuition}>Calculate Estimated Tuition</button>

        {showError && (
          <div className="error-message">
            Please fill in all fields (campus, residency, household size, income, and student grade) to calculate your estimated tuition.
          </div>
        )}

        {showGradeWarning && (
          <div className="grade-warning">
            <strong>Note:</strong> This grade will be phased in over the 2027-28, 2028-29, and 2029-30 school years, but will not be offered at Aug Prep North in the 2026-27 school year.
          </div>
        )}

        {showMarriageNote && (
          <div className="marriage-note" id="marriageNote">
            <strong>Important Notice for Married Families:</strong><br />
            {marriageNoteText}
          </div>
        )}

        {showResults && (
          <div className="results show" id="results">
            <div className="result-row">
              <span className="result-label">Base Tuition Rate:</span>
              <span className="result-value" style={results.isChoice ? {textDecoration: 'line-through', opacity: 0.6} : {}}>
                ${results.baseTuition.toLocaleString()}
              </span>
            </div>
            {!results.isChoice && results.showFoundingFamilies && (
              <div className="result-row">
                <span className="result-label">Founding Families Discount (10%):</span>
                <span className="result-value">${results.foundingFamiliesAmount.toLocaleString()}</span>
              </div>
            )}
            {!results.isChoice && results.showSiblingDiscount && (
              <div className="result-row">
                <span className="result-label">Sibling Discount (10%):</span>
                <span className="result-value">${results.siblingDiscountAmount.toLocaleString()}</span>
              </div>
            )}
            {!results.isChoice && results.showFinancialAid && (
              <>
                <div className="result-row">
                  <span className="result-label">Financial Aid Award Percentage:</span>
                  <span className="result-value">{results.financialAidPercentage}%</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Financial Aid Award:</span>
                  <span className="result-value">${results.financialAidAmount.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="result-row final-row">
              <span className="result-label">{results.finalTuitionLabel}</span>
              <span className="result-value">
                {results.isChoice 
                  ? 'You Qualify for the Choice Program - No Tuition Charged to Students Awarded a Choice Scholarship'
                  : `$${results.finalTuition.toLocaleString()}`
                }
              </span>
            </div>
            <div className={results.infoClass} dangerouslySetInnerHTML={{ __html: results.infoText }} />
            <div className="disclaimer-results">
              <strong>Disclaimer:</strong> This estimate is based on the information provided and current income thresholds. Final tuition determination requires income verification and may differ from this estimate. Choice program eligibility is subject to application approval and available seats.
            </div>
          </div>
        )}

        {showPaymentPlans && (
          <div className="payment-plans show">
            <h3>Payment Plan Options</h3>
            <div className="deposit-info">
              <strong>Enrollment Deposit:</strong> $500 (secures your child&apos;s seat and is applied to tuition)
            </div>
            
            <div className="payment-options">
              <div className="payment-option">
                <div className="payment-title">Pay in Full</div>
                <div className="payment-subtitle">(5% discount included)</div>
                <div className="payment-amount">${results.fullPayment.toLocaleString()}</div>
                <div className="payment-details">Due:&nbsp;June&nbsp;15th</div>
              </div>
              
              <div className="payment-option">
                <div className="payment-title">Quarterly Payments</div>
                <div className="payment-amount">${results.quarterlyPayment.toLocaleString()} × 4</div>
                <div className="payment-details">Due: June 15th, September 15th, December 15th, March 15th</div>
              </div>
              
              <div className="payment-option">
                <div className="payment-title">Monthly Payments</div>
                <div className="payment-amount">${results.monthlyPayment.toLocaleString()} × 10</div>
                <div className="payment-details">Due: 15th of each month from June through March</div>
              </div>
              
              <div className="payment-option contact-option">
                <div className="payment-title">Contact Admissions</div>
                <div className="contact-text">Additional grants and financial assistance may be available beyond what is shown above. Questions about payment plans, additional assistance, or need more information?</div>
                <div className="contact-email">
                  <a href="mailto:admissions@augprep.org">admissions@augprep.org</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
