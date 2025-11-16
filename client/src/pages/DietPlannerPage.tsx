import React, { useState, useMemo } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import './DietPlannerPage.css';

// --- 1. DEFINE QUESTION DATA STRUCTURE ---
interface Option {
  text: string;
  dosha?: string;
  activity?: string;
  exercise?: string;
  goal?: string;
  stress?: string;
  diet?: string;
  avoid?: string | null;
  prefer?: string;
  allergy?: string | null;
  meals?: number;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

// --- 2. QUESTIONNAIRE DATA ---
const questionsData: Question[] = [
  {
    "id": 1,
    "question": "1. My physical body frame is best described as:",
    "options": [
      {"text": "Thin and light; I find it difficult to gain weight.", "dosha": "Vata"},
      {"text": "Medium and athletic; I build muscle with relative ease.", "dosha": "Pitta"},
      {"text": "Broad and sturdy; I tend to gain weight easily.", "dosha": "Kapha"},
      {"text": "A combination of two of the above.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 2,
    "question": "2. My skin typically tends to be:",
    "options": [
      {"text": "Dry, thin, and feels cool to the touch.", "dosha": "Vata"},
      {"text": "Sensitive, warm, prone to redness or acne.", "dosha": "Pitta"},
      {"text": "Thick, smooth, oily, and well-hydrated.", "dosha": "Kapha"},
      {"text": "Combination skin that varies.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 3,
    "question": "3. My hair texture is naturally:",
    "options": [
      {"text": "Dry, thin, brittle, or frizzy.", "dosha": "Vata"},
      {"text": "Fine, straight, prone to early graying.", "dosha": "Pitta"},
      {"text": "Thick, wavy, strong, and often oily.", "dosha": "Kapha"},
      {"text": "Generally average.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 4,
    "question": "4. My appetite and eating habits are:",
    "options": [
      {"text": "Irregular; I sometimes forget to eat.", "dosha": "Vata"},
      {"text": "Strong and sharp; I get irritable if I miss a meal.", "dosha": "Pitta"},
      {"text": "Slow and steady; I can easily skip a meal.", "dosha": "Kapha"},
      {"text": "Generally regular and moderate.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 5,
    "question": "5. My digestion tends to be:",
    "options": [
      {"text": "Prone to gas, bloating, and inconsistent.", "dosha": "Vata"},
      {"text": "Strong but can cause acidity or heartburn.", "dosha": "Pitta"},
      {"text": "Slow and heavy; I feel full long after eating.", "dosha": "Kapha"},
      {"text": "Usually reliable.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 6,
    "question": "6. My energy pattern throughout the day is typically:",
    "options": [
      {"text": "Quick bursts, then fatigue.", "dosha": "Vata"},
      {"text": "Focused and intense.", "dosha": "Pitta"},
      {"text": "Steady and consistent.", "dosha": "Kapha"},
      {"text": "Highly variable.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 7,
    "question": "7. My sleep is usually:",
    "options": [
      {"text": "Light and easily disturbed.", "dosha": "Vata"},
      {"text": "Sound and restful but I may wake up hot.", "dosha": "Pitta"},
      {"text": "Deep and heavy; hard to wake up.", "dosha": "Kapha"},
      {"text": "Generally good.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 8,
    "question": "8. My profession or daily activity involves:",
    "options": [
      {"text": "Mostly sitting (desk job, driving).", "activity": "sedentary"},
      {"text": "Mix of sitting and moving (teaching, housework).", "activity": "moderate"},
      {"text": "Mostly standing/active work (construction, fitness).", "activity": "active"},
      {"text": "Work from home with variable routine.", "activity": "mixed"}
    ]
  },
  {
    "id": 9,
    "question": "9. How often do you exercise?",
    "options": [
      {"text": "Rarely or never.", "exercise": "low"},
      {"text": "1-2 times per week.", "exercise": "light"},
      {"text": "3-4 times per week.", "exercise": "moderate"},
      {"text": "5 or more times per week.", "exercise": "high"}
    ]
  },
  {
    "id": 10,
    "question": "10. What is your primary health goal?",
    "options": [
      {"text": "Manage weight.", "goal": "weight"},
      {"text": "Improve digestion.", "goal": "digestion"},
      {"text": "Increase energy.", "goal": "energy"},
      {"text": "Manage stress.", "goal": "stress"},
      {"text": "Overall wellness & immunity.", "goal": "immunity"}
    ]
  },
  {
    "id": 11,
    "question": "11. How stressed do you feel?",
    "options": [
      {"text": "Low.", "stress": "low"},
      {"text": "Moderate.", "stress": "medium"},
      {"text": "High.", "stress": "high"},
      {"text": "Very high.", "stress": "very_high"}
    ]
  },
  {
    "id": 12,
    "question": "12. When stressed, I usually:",
    "options": [
      {"text": "Become anxious, mind races.", "dosha": "Vata"},
      {"text": "Become irritable, angry.", "dosha": "Pitta"},
      {"text": "Withdraw, crave comfort food.", "dosha": "Kapha"},
      {"text": "Reaction is unpredictable.", "dosha": "Mixed"}
    ]
  },
  {
    "id": 13,
    "question": "13. Do you follow a dietary pattern?",
    "options": [
      {"text": "Vegetarian", "diet": "vegetarian"},
      {"text": "Vegan", "diet": "vegan"},
      {"text": "Non-Vegetarian", "diet": "non-vegetarian"},
      {"text": "Eggetarian", "diet": "eggetarian"}
    ]
  },
  {
    "id": 14,
    "question": "14. Are there foods you dislike or avoid? (Select the primary one to avoid)",
    "options": [
      {"text": "Dairy", "avoid": "dairy"},
      {"text": "Spicy", "avoid": "spicy"},
      {"text": "Fried", "avoid": "fried"},
      {"text": "Sweets", "avoid": "sugar"},
      {"text": "Meat", "avoid": "meat"},
      {"text": "Gluten", "avoid": "gluten"},
      {"text": "None", "avoid": null}
    ]
  },
  {
    "id": 15,
    "question": "15. Foods you enjoy/prefer? (Select the primary one to prefer)",
    "options": [
      {"text": "Fruits", "prefer": "fruits"},
      {"text": "Leafy vegetables", "prefer": "leafy"},
      {"text": "Grains", "prefer": "grains"},
      {"text": "Pulses/legumes", "prefer": "pulses"},
      {"text": "Dairy products", "prefer": "dairy"},
      {"text": "Non-veg protein", "prefer": "non-veg"},
      {"text": "Herbal drinks", "prefer": "herbal"}
    ]
  },
  {
    "id": 16,
    "question": "16. Do you have allergies/restrictions?",
    "options": [
      {"text": "Yes (specify in the box below).", "allergy": "custom"},
      {"text": "No.", "allergy": null}
    ]
  },
  {
    "id": 17,
    "question": "17. How many meals do you prefer per day?",
    "options": [
      {"text": "2 meals", "meals": 2},
      {"text": "3 meals", "meals": 3},
      {"text": "4-5 small meals", "meals": 5}
    ]
  }
];

interface FormSelections {
  age: string;
  gender: string;
  extraDetails: string;
  [key: string]: string;
}

const DietPlannerPage: React.FC = () => {
  const initialState: FormSelections = {
    age: '25',
    gender: 'Female',
    extraDetails: '',
  };

  questionsData.forEach(q => (initialState[q.id] = ''));

  const [formData, setFormData] = useState<FormSelections>(initialState);
  const [dietPlan, setDietPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dietPlanRef = React.useRef<HTMLDivElement>(null);

  const requiredQuestionIds = questionsData.map(q => q.id);

  const isFormComplete = useMemo(() => {
    if (!formData.age || !formData.gender) return false;
    for (const id of requiredQuestionIds) {
      if (!formData[id]) return false;
      if (formData[id] === "Other" && !formData[`${id}_other`]) return false;
    }
    return true;
  }, [formData, requiredQuestionIds]);

  const handleOptionClick = (field: keyof FormSelections | number, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      setError('Please answer all required questions.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDietPlan('');

    const payload = {
      age: formData.age,
      gender: formData.gender,
      extraDetails: formData.extraDetails,
      surveyResults: questionsData.map(q => {
        const selectedOptionText = formData[q.id];
        const selectedOption = q.options.find(opt => opt.text === selectedOptionText);

        return {
          questionId: q.id,
          question: q.question,
          answer:
            selectedOptionText === "Other"
              ? formData[`${q.id}_other`] || "Other (not specified)"
              : selectedOptionText,
          data: selectedOption,
        };
      }).filter(res => res.answer)
    };

    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      const token = storedUserInfo ? JSON.parse(storedUserInfo).token : null;
      if (!token) throw new Error('Authentication token not found.');

      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/diet/generate', payload, config);
      setDietPlan(data.dietPlan);
    } catch (err: unknown) {
      let message = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = dietPlanRef.current;
    if (element) {
      const opt = {
        margin: 10,
        filename: 'ArogyaPath-Diet-Plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const html2pdfAny = (html2pdf as any);
      html2pdfAny().from(element).set(opt).save();
      

    }
  };

  // ✅ Updated renderOptions with “Something else” option
  const renderOptions = (questionId: number, options: Option[]) => {
    const isOtherSelected = formData[questionId] === "Other";

    return (
      <div className="options-container">
        {options.map((option) => (
          <button
            type="button"
            key={option.text}
            className={`option-button ${formData[questionId] === option.text ? 'selected' : ''}`}
            onClick={() => handleOptionClick(questionId, option.text)}
          >
            {option.text}
          </button>
        ))}

        {/* Add "Something else" button */}
        <button
          type="button"
          className={`option-button ${isOtherSelected ? 'selected' : ''}`}
          onClick={() => handleOptionClick(questionId, "Other")}
        >
          Something else
        </button>

        {/* Conditional text box */}
        {isOtherSelected && (
          <input
            type="text"
            className="other-input"
            placeholder="Please specify..."
            value={formData[`${questionId}_other`] || ""}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                [`${questionId}_other`]: e.target.value,
              }))
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className="diet-planner-container">
      <h2>Your Personalized Ayurvedic Diet Planner</h2>

      {!dietPlan ? (
        <form onSubmit={handleSubmit} className="questionnaire-form">
          <p className="intro-text">Answer the questions below to generate your personalized plan.</p>

          {questionsData.map((q) => (
            <div className="question-block" key={q.id}>
              <label>{q.question}</label>
              {renderOptions(q.id, q.options)}
            </div>
          ))}

          <div className="question-block-inline">
            <div className="inline-field">
              <label htmlFor="age">18. Your Age:</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleTextChange} required />
            </div>
            <div className="inline-field">
              <label htmlFor="gender">19. Your Gender:</label>
              <div className="options-container">
                {['Male', 'Female', 'Other'].map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`option-button ${formData.gender === option ? 'selected' : ''}`}
                    onClick={() => handleOptionClick('gender', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="question-block">
            <label htmlFor="extraDetails">20. Any allergies or details to add? (optional)</label>
            <textarea
              id="extraDetails"
              name="extraDetails"
              value={formData.extraDetails}
              onChange={handleTextChange}
              placeholder="e.g., allergic to peanuts, dislike spinach..."
            />
          </div>

          <div className="generate-section">
            <button type="submit" className="generate-button" disabled={!isFormComplete || isLoading}>
              {isLoading ? 'Generating...' : 'Generate a Diet Chart'}
            </button>
            {!isFormComplete && !isLoading && (
              <p className="form-incomplete-message">Please answer all questions to enable generation.</p>
            )}
          </div>
        </form>
      ) : (
        <>
          <div className="diet-plan-result" ref={dietPlanRef}>
            <ReactMarkdown>{dietPlan}</ReactMarkdown>
          </div>
          <div className="result-actions">
            <button onClick={handleDownload} className="download-button">Download as PDF</button>
            <button onClick={() => setDietPlan('')} className="generate-button">Generate a New Plan</button>
          </div>
        </>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DietPlannerPage;
