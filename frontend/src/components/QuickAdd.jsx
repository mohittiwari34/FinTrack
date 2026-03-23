import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Zap, Mic, MicOff } from 'lucide-react';

const QuickAdd = () => {
    const { addExpense } = useContext(AppContext);
    const [quickText, setQuickText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setQuickText('');
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            setQuickText(speechResult);
            parseAndAdd(speechResult);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            alert('Microphone error or access denied.');
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const parseAndAdd = async (text) => {
        setIsSubmitting(true);
        try {
            // NLP parser mapping
            const amountMatch = text.match(/\d+(\.\d+)?/);
            if (!amountMatch) {
                alert("Please include an amount (e.g., '150 for food')");
                return;
            }
            
            const amount = parseFloat(amountMatch[0]);

            const lowerText = text.toLowerCase();
            let category = 'Other';
            if (lowerText.match(/food|burger|lunch|pizza|dinner|breakfast|meal|snack/)) category = 'Food';
            else if (lowerText.match(/drink|tea|coffee|juice|beverage|water|soda/)) category = 'Drinks';
            else if (lowerText.match(/movie|cinema|theatre|netflix|entertainment|show/)) category = 'Entertainment';
            else if (lowerText.match(/study|book|course|tuition|education|school|college|pen/)) category = 'Education';
            else if (lowerText.match(/health|doctor|medicine|pharmacy|hospital|clinic/)) category = 'Health';
            else if (lowerText.match(/travel|taxi|uber|bus|train|flight|auto|cab/)) category = 'Travel';
            else if (lowerText.match(/shop|grocer|buy|clothes|mall|supermarket/)) category = 'Shopping';
            else if (lowerText.match(/bill|pay|rent|electricity|wifi|internet|recharge/)) category = 'Bills';

            const note = text.replace(amountMatch[0], '').trim() || 'Quick add';

            await addExpense({
                amount,
                category,
                paymentMethod: 'Cash', // Default assumed for quick add
                note,
                date: new Date().toISOString()
            });

            setQuickText('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && quickText && !isSubmitting) {
            parseAndAdd(quickText);
        }
    };

    const handleChipClick = async (amount, category, note) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await addExpense({
                amount,
                category,
                paymentMethod: 'Cash',
                note,
                date: new Date().toISOString()
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card mb-6" style={{ background: 'var(--primary-gradient)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 className="mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                <Zap size={20} fill="currentColor" /> Lightning Quick Add
            </h3>
            
            <div className="flex gap-4 items-center flex-wrap">
                <div style={{ position: 'relative', flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        className="form-control m-0" 
                        style={{ 
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.15)', 
                            color: 'white', 
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(8px)',
                            paddingRight: '40px'
                        }}
                        placeholder="Type or say '150 for lunch'..." 
                        value={quickText}
                        onChange={(e) => setQuickText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting || isListening}
                    />
                    <button
                        onClick={isListening ? null : startListening}
                        disabled={isSubmitting}
                        type="button"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            color: isListening ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
                            cursor: isListening ? 'default' : 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: isListening ? 'pulse 1.5s infinite' : 'none',
                            outline: 'none'
                        }}
                        title={isListening ? 'Listening...' : 'Click to speak'}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                </div>
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
                <button 
                    onClick={() => { if(quickText) parseAndAdd(quickText); }} 
                    className="btn"
                    style={{ background: 'white', color: 'var(--primary)' }}
                    disabled={isSubmitting || !quickText}
                >
                    {isSubmitting ? 'Adding...' : 'Add'}
                </button>
            </div>

            <div className="mt-4">
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontWeight: 500 }}>Or 1-Click Presets:</p>
                <div className="flex gap-2 flex-wrap">
                    <button 
                        onClick={() => handleChipClick(100, 'Food', 'Food 🍔')} 
                        className="badge" 
                        style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                        disabled={isSubmitting}
                    >
                        ₹100 Food 🍔
                    </button>
                    <button 
                        onClick={() => handleChipClick(50, 'Travel', 'Travel 🚕')} 
                        className="badge" 
                        style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                        disabled={isSubmitting}
                    >
                        ₹50 Travel 🚕
                    </button>
                    <button 
                        onClick={() => handleChipClick(200, 'Shopping', 'Shopping 🛒')} 
                        className="badge" 
                        style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                        disabled={isSubmitting}
                    >
                        ₹200 Shopping 🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickAdd;
