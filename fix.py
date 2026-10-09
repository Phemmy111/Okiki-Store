import re

with open('src/app/(store)/quote/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<h2 className="font-bold text-navy text-lg">Your Details</h2>',
    '''<h2 className="font-bold text-navy text-lg">Your Details</h2>
            {isLoaded && !isSignedIn && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm mb-4">
                <p className="text-blue-800 mb-2"><strong>Want to track this order across all your devices?</strong></p>
                <SignInButton mode="modal">
                  <button type="button" className="text-blue-600 font-bold hover:underline">Log in or create an account</button>
                </SignInButton>
                <span className="text-blue-800"> before checking out!</span>
              </div>
            )}'''
)

content = content.replace(
    'name="name"\n                required',
    'name="name"\n                required\n                defaultValue={user?.fullName || ""}'
)
content = content.replace(
    'name="email"\n                required',
    'name="email"\n                required\n                defaultValue={user?.primaryEmailAddress?.emailAddress || ""}'
)
with open('src/app/(store)/quote/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
