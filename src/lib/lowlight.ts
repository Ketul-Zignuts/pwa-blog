// cSpell: disable
import { createLowlight } from 'lowlight'

import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'

const lowlight = createLowlight()

lowlight.register('javascript', javascript)
lowlight.register('python', python)
lowlight.register('css', css)
lowlight.register('bash', bash)

export { lowlight }
