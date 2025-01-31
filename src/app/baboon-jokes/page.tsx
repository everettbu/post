const jokes = [
  {
    question: "What do you call a flying primate?",
    answer: "A hot air baboon!"
  },
  {
    question: "What do you call a naughty monkey?",
    answer: "A badboon!"
  },
  {
    question: "What do you call an exploding monkey?",
    answer: "A baBOOM!"
  },
  {
    question: "What do baboon's do in the club?",
    answer: "Make it Plantain."
  },
  {
    question: "What is a Baboon's favorite cookie?",
    answer: "Chocolate chimp!"
  },
  {
    question: "What kind of monkey flies to school?",
    answer: "A hot air baboon."
  },
  {
    question: "How did Gertie Baboon win the beauty contest?",
    answer: "She was the beast of the show!"
  },
  {
    question: "How do you prepare a Baboon sundae?",
    answer: "Your start getting it ready Fridae and Saturdae!"
  },
  {
    question: "What did George Washington have to do with Baboons?",
    answer: "As little as possible, dummy!"
  },
  {
    question: "What do you feed a 600 pound Baboon?",
    answer: "Anything it wants!"
  },
  {
    question: "What does a Baboon attorney study?",
    answer: "The Law of the jungle!"
  },
  {
    question: "What does a Baboon learn first in school?",
    answer: "The Apey-cees!"
  },
  {
    question: "What gives a Baboon good taste?",
    answer: "Four years in an Ivy League school!"
  },
  {
    question: "What happens if you cross a parrot with a Baboon?",
    answer: "Nobody is sure, but if it opened its mouth to speak, you'd listen!"
  },
  {
    question: "When did the Baboons start to picket the cookie factory?",
    answer: "The day they started to manufacture animal crackers!"
  },
  {
    question: "Which author do the Baboons love most?",
    answer: "Joh Steinbeck - who wrote 'The Apes of Wrath!'"
  },
  {
    question: "Which drink makes a Baboon feel tipsy?",
    answer: "An ape-ricot sour!"
  },
  {
    question: "Which technique does a Baboon borrow from another animal when it gets romantic?",
    answer: "The bear hug!"
  },
  {
    question: "Who is the Baboons' favourite President of recent years?",
    answer: "Hairy Truman!"
  },
  {
    question: "Why did both Germany and the U.S want to hire Baboons during World War Two?",
    answer: "Because they are excellent at waging Gorilla warfare!"
  },
  {
    question: "Why did the actor fire his Baboon agent?",
    answer: "The big Ape kept wanting to take more than a 10% bite!"
  },
  {
    question: "Why did the female Baboon, engaged to the invisible man, call off the wedding?",
    answer: "Because in the last analysis she just couldn't see it!"
  },
  {
    question: "Why did the Baboon fail English?",
    answer: "He had little Ape-titude!"
  },
  {
    question: "Why do waiters like Baboons better than flies?",
    answer: "Did you ever hear a customer complain 'Waiter, there's a Baboon in my soup!'"
  },
  {
    question: "Why do Baboons have big nostrils?",
    answer: "They have big fingers."
  },
  {
    question: "How do you make a Baboon laugh?",
    answer: "Tell it a whale of a tale!"
  },
  {
    question: "How do you make a Baboon float?",
    answer: "Two scoops of ice cream, some club soda and a very tasty Baboon!"
  },
  {
    question: "Why don't the Baboons in the jungle play poker any more?",
    answer: "There are just too many Cheetahs."
  },
  {
    question: "Why are Baboons so noisy?",
    answer: "They were raised in a zoo!"
  },
  {
    question: "How did a Baboon come to be with Washington at Valley Forge?",
    answer: "He had seen a sign saying, 'Uncle Simian Wants You!'"
  },
  {
    question: "Why did the Baboon fall out of the tree?",
    answer: "It was dead."
  },
  {
    question: "What do Baboons do when they're mad at each other?",
    answer: "They have a Gorilla war!"
  },
  {
    question: "Why did the Baboon go to the doctor?",
    answer: "Because his banana wasn't peeling very well!"
  },
  {
    question: "What should you do if you find a Baboon sitting at your school desk?",
    answer: "Sit somewhere else!"
  },
  {
    question: "What's a Baboon's favourite drink?",
    answer: "A sas-gorilla."
  },
  {
    question: "How do Baboons get down the stairs?",
    answer: "They slide down the banana-ster!"
  }
];

export default function BaboonJokes() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Baboon Jokes</h1>
      <div className="space-y-4">
        {jokes.map((joke, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <p className="font-semibold text-gray-800">{joke.question}</p>
            <p className="mt-2 text-gray-700">{joke.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

